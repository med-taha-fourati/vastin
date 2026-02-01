"use client";


import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Funnel_Display } from "next/font/google";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Card,
    CardMedia,
    Grid,
    CardContent,
    Skeleton,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Video } from "@/types/Video";
import ProfileComponent from "@/components/Profile/profileComponent";
import { Menu, Home, User, Sun, Moon, LogOut } from "lucide-react";
import { darkColorScheme, lightColorScheme } from "@/lib/colorScheme";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"] });

export default function Explore() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState<"videos" | "profile">("videos");
    const [mode, setMode] = useState<"light" | "dark">("dark");

    const theme = useMemo(
        () =>
            createTheme({
                typography: {
                    fontFamily: funnelDisplay.style.fontFamily,
                },
                palette: {
                    mode,
                    primary: {
                        main: mode === "dark" ? `#${darkColorScheme.accent}` : `#${lightColorScheme.accent}`,
                    },
                    secondary: {
                        main: mode === "dark" ? `#${darkColorScheme.highlight}` : `#${lightColorScheme.highlight}`,
                    },
                    background: {
                        default: mode === "dark" ? `#${darkColorScheme.light}` : `#${lightColorScheme.light}`,
                        paper: mode === "dark" ? `#${darkColorScheme.light}` : `#${lightColorScheme.light}`,
                    },
                    text: {
                        primary: mode === "dark" ? `#${darkColorScheme.dark}` : `#${lightColorScheme.dark}`,
                        secondary: mode === "dark" ? `#${darkColorScheme.base}` : `#${lightColorScheme.base}`,
                    },
                },
            }),
        [mode]
    );

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch("/api/videos");
                if (res.ok) {
                    const data = await res.json();
                    setVideos(data);
                }
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const drawerWidth = isSidebarOpen ? 240 : 70;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "background.paper", color: "text.primary" }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleSidebar}
                            sx={{ mr: 2 }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Vastin
                        </Typography>

                        <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                            {mode === "light" ? <Sun /> : <Moon />}
                        </IconButton>

                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                                    {user.username}
                                </Typography>
                                <IconButton onClick={() => logout()} color="inherit" title="Logout">
                                    <LogOut />
                                </IconButton>
                            </Box>
                        ) : (
                            <Link href="/login" passHref>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'black',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Sign In
                                </Box>
                            </Link>
                        )}
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            bgcolor: "background.paper",
                            color: "text.primary",
                            marginTop: "64px",
                            borderRight: 1,
                            borderColor: "divider",
                            transition: "width 0.2s",
                            overflowX: "hidden",
                        },
                    }}
                >
                    <Box sx={{ overflow: "auto", mt: 1 }}>
                        <List>
                            <ListItem disablePadding sx={{ display: "block", px: 1, py: 0.5 }}>
                                <ListItemButton
                                    onClick={() => setCurrentView("videos")}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: isSidebarOpen ? "initial" : "center",
                                        px: 2.5,
                                        borderRadius: 2,
                                        bgcolor: currentView === "videos" ? "action.selected" : "transparent",
                                        "&:hover": { bgcolor: "action.hover" },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: isSidebarOpen ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "inherit",
                                        }}
                                    >
                                        <Home size={22} />
                                    </ListItemIcon>
                                    <ListItemText primary="Explore" sx={{ opacity: isSidebarOpen ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding sx={{ display: "block", px: 1, py: 0.5 }}>
                                <ListItemButton
                                    onClick={() => setCurrentView("profile")}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: isSidebarOpen ? "initial" : "center",
                                        px: 2.5,
                                        borderRadius: 2,
                                        bgcolor: currentView === "profile" ? "action.selected" : "transparent",
                                        "&:hover": { bgcolor: "action.hover" },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: isSidebarOpen ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "inherit",
                                        }}
                                    >
                                        <User size={22} />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" sx={{ opacity: isSidebarOpen ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
                    {currentView === "profile" ? (
                        <ProfileComponent />
                    ) : (
                        <Box>
                            {loading && (
                                <Grid container spacing={3}>
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                                            <Card sx={{ bgcolor: "background.paper" }}>
                                                <Skeleton variant="rectangular" height={160} animation="wave" />
                                                <CardContent>
                                                    <Skeleton width="80%" animation="wave" />
                                                    <Skeleton width="60%" animation="wave" />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {!loading && videos.length === 0 && (
                                <Typography sx={{ textAlign: "center", mt: 10, fontSize: 18 }}>
                                    no videos have been uploaded to the website, be the first one!
                                </Typography>
                            )}

                            {!loading && videos.length > 0 && (
                                <Grid container spacing={3}>
                                    {videos.map((video) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={Number(video.id)}>
                                            <Link href={`/watch/${video.id}`} passHref style={{ textDecoration: 'none' }}>
                                                <Card sx={{ bgcolor: "background.paper", cursor: "pointer", height: '100%' }}>
                                                    <CardMedia component="img" height="160" image={video.thumbnailPath || "/placeholder.jpg"} />
                                                    <CardContent>
                                                        <Typography sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>{video.title}</Typography>
                                                        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>{video.owner?.username}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
