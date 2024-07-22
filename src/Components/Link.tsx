import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link as LinkIcon, ContentCopy, Timeline } from "@mui/icons-material";
import { useState } from "react";

interface LinkProps {
  id: string;
  name: string;
  shortUrl: string;
  createdAt: Date;
  clicks: number;
}

function Link({ name, shortUrl, createdAt, clicks }: LinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3, overflow: "visible" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", flexGrow: 1, mr: 2 }}
          >
            {name}
          </Typography>
          <Box>
            <Tooltip title={copied ? "Copied!" : "Copy URL"}>
              <IconButton onClick={handleCopy} size="small" sx={{ mr: 1 }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Chip
              icon={<LinkIcon />}
              label={shortUrl}
              clickable
              color="primary"
              size="small"
              onClick={() => window.open(`http://${shortUrl}`, "_blank")}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Created: {createdAt.toLocaleDateString()}
          </Typography>
          <Chip
            icon={<Timeline fontSize="small" />}
            label={`${clicks} clicks`}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default Link;
