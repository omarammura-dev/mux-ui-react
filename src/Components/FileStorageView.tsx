import React, { useState, useEffect } from "react";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Fade,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Description as DocumentIcon,
  Image as ImageIcon,
  Movie as VideoIcon,
  InsertDriveFile as DefaultIcon,
  CloudUpload as UploadIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { del, get } from "../Service/request";
import Authentication from "../Service/Auth/Authentication";

interface FileItem {
  id: string;
  fileName: string;
  contentType: string;
  fileId: string | null;
}

const FileStorageView: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadInterval, setUploadInterval] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    fileId: string;
  } | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await get("/files");
        setFiles(res);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []); // Empty dependency array to run only once on component mount

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) {
      return <ImageIcon />;
    } else if (contentType.startsWith("video/")) {
      return <VideoIcon />;
    } else if (contentType === "application/pdf") {
      return <PictureAsPdfIcon />;
    } else if (contentType.startsWith("audio/")) {
      return <DocumentIcon />;
    } else {
      return <DefaultIcon />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => uploadFile(file));
    }
  };

  const uploadFile = (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const fileData = event.target.result;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/upload-file");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", Authentication.getToken() || "");
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            setUploading(false);
            setUploadProgress(100);
            // Add the uploaded file to the list
            setFiles((prevFiles) => {
              if (Array.isArray(prevFiles)) {
                return [
                  ...prevFiles,
                  {
                    id: String(Date.now()),
                    fileName: file.name,
                    contentType: file.type,
                    fileId: null,
                  },
                ];
              } else {
                // If prevFiles is not iterable, return a new array with just the new file
                return [
                  {
                    id: String(Date.now()),
                    fileName: file.name,
                    contentType: file.type,
                    fileId: null,
                  },
                ];
              }
            });
          } else {
            console.error("Upload failed");
            setUploading(false);
          }
        };

        xhr.onerror = () => {
          console.error("Upload failed");
          setUploading(false);
        };

        const body = JSON.stringify({
          filename: file.name,
          filedata: fileData,
        });
        xhr.send(body);
      }
    };
    reader.readAsDataURL(file);
  };

  const cancelUpload = () => {
    if (uploadInterval) {
      clearInterval(uploadInterval);
      setUploadInterval(null);
    }
    setUploading(false);
    setUploadProgress(0);
  };

  const handleContextMenu = (event: React.MouseEvent, fileId: string) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            fileId,
          }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDownload = async () => {
    if (!contextMenu) return;

    const fileToDownload = files.find((file) => file.id === contextMenu.fileId);
    if (!fileToDownload) {
      console.error("File not found");
      handleCloseContextMenu();
      return;
    }

    try {
      const response = await get(`/get-file/${fileToDownload.fileId}`, {
        responseType: "blob",
      });
      const blob = new Blob([response], { type: fileToDownload.contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileToDownload.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
    handleCloseContextMenu();
  };

  const handleDelete = async () => {
    if (!contextMenu) return;
    const fileToDelete = files.find((file) => file.id === contextMenu.fileId);
    if (!fileToDelete) {
      console.error("File not found");
      handleCloseContextMenu();
      return;
    }
    try {
      const res = await del(`/file/${fileToDelete.fileId}`);
      if (res.status === 200) {
        console.log("File deleted successfully");
        setFiles(files.filter((file) => file.id !== fileToDelete.id));
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    handleCloseContextMenu();
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        position: "relative",
        minHeight: "100vh",
        transition: "box-shadow 0.3s ease-in-out",
        boxShadow: isDragging ? "inset 0 0 0 2px #1976d2" : "none",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Typography variant="h4" color="primary">
            Drop files here to upload
          </Typography>
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Files
      </Typography>
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        component="label"
        sx={{ position: "absolute", top: 16, right: 16, marginRight: 2 }}
      >
        Upload File
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
      <Grid container spacing={2}>
        {files?.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
                onClick={(e) => handleContextMenu(e, file.id)}
              >
                <MoreVertIcon />
              </IconButton>
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 2,
                  paddingRight: 6, // Add padding to the right to prevent the menu from covering the name
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFileIcon(file.contentType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.fileName}
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: "subtitle1",
                      fontWeight: "medium",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ mt: "auto" }}
                >
                  {file.contentType}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fade in={uploading}>
        <Card
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            width: 200,
            zIndex: 1000,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6">Uploading...</Typography>
              <IconButton onClick={cancelUpload} size="small">
                <CancelIcon />
              </IconButton>
            </Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {`${Math.round(uploadProgress)}%`}
            </Typography>
          </CardContent>
        </Card>
      </Fade>
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FileStorageView;
