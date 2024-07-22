import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Tooltip,
  Fade,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MouseIcon from "@mui/icons-material/Mouse";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { get, post, del } from "../Service/request";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";

interface LinkData {
  _id: string;
  name: string;
  shortUrl: string;
  createdAt: Date;
  clicks: number;
}

function Links() {
  const [open, setOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const queryClient = useQueryClient();
  const { mutate: deleteLink } = deleteLinkMutation();
  const { data: links, isLoading } = useQuery<LinkData[], Error>(
    "links",
    () => get<LinkData[]>("/url"),
    {
      onError: (error) => {
        console.error("Error fetching links:", error);
      },
    }
  );

  const createLinkMutation = useMutation<
    LinkData,
    Error,
    { name: string; url: string }
  >(
    (newLink) =>
      post<{ name: string; url: string }, LinkData>("/url/shrink", newLink),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("links");
        handleClose();
      },
      onError: (error) => {
        console.error("Error creating new link:", error);
      },
    }
  );

  const handleDelete = (id: string) => {
    deleteLink(id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewLinkName("");
    setNewLinkUrl("");
  };

  const handleSave = () => {
    createLinkMutation.mutate({ name: newLinkName, url: newLinkUrl });
  };

  const handleCopyShortUrl = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    // You might want to add a snackbar or toast notification here
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Your Links
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            startIcon={<LinkIcon />}
            sx={{ borderRadius: 28, textTransform: "none" }}
          >
            Add New Link
          </Button>
        </Box>
        <Grid container spacing={3}>
          {links?.map((link: LinkData) => (
            <Grid item xs={12} sm={6} md={4} key={link._id}>
              <Fade in={true} timeout={500}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {link.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "grey.100",
                        borderRadius: 1,
                        p: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {link.shortUrl}
                      </Typography>
                      <IconButton
                        onClick={() => handleCopyShortUrl(link.shortUrl)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box display="flex" alignItems="center" mt={2}>
                      <Tooltip title="Created At" arrow>
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={format(
                            new Date(link.createdAt),
                            "MMM d, yyyy"
                          )}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      </Tooltip>
                      <Tooltip title="Clicks" arrow>
                        <Chip
                          icon={<MouseIcon />}
                          label={link.clicks}
                          size="small"
                          color="primary"
                        />
                      </Tooltip>
                    </Box>
                  </CardContent>
                  <CardActions
                    disableSpacing
                    sx={{ justifyContent: "flex-end" }}
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(link._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Link Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="url"
            label="Long Link"
            type="url"
            fullWidth
            variant="outlined"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={createLinkMutation.isLoading}
            variant="contained"
            color="primary"
          >
            {createLinkMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export function deleteLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => del(`/url/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries("links");
    },
    onError: (error) => {
      console.error("Error deleting link:", error);
    },
  });
}
export default Links;
