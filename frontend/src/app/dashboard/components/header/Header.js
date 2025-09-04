'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation'; // Importe useRouter
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Adb } from '@mui/icons-material';

const pageRoutes = {
    'Gerenciamento': '/dashboard/management',
    'Serviços': '/dashboard/services',
    'Solicitações': '/dashboard/solicitations'
};

const settingsPage = {
    'Perfil': '/dashboard/perfil',
    'Configurações': '/dashboard/settings'
};

const pages = Object.keys(pageRoutes);
const settings = ['Perfil', 'Configurações', 'Sair'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [username, setUsername] = React.useState(''); 
    const [userType, setUserType] = React.useState(''); 
    const router = useRouter(); 

    React.useEffect(() => {
        const storedUsername = Cookies.get('nome');
        if (storedUsername) {
        setUsername(storedUsername);
        }

        const storedUserType = Cookies.get('tipo');
        if (storedUserType) {
        setUserType(storedUserType);
        }
    }, []);


    const handleOpenNavMenu = (event) => { setAnchorElNav(event.currentTarget); };
    const handleOpenUserMenu = (event) => { setAnchorElUser(event.currentTarget); };

    const handleCloseNavMenu = () => { setAnchorElNav(null); };
    const handleCloseUserMenu = () => { setAnchorElUser(null); };

    const handleSettingsClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Sair') {
        handleLogout();
    } else {
        const route = settingsPage[setting];
        if (route) {
            router.push(route);
        }
    }
};

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/user/logout', {}, { withCredentials: true });
        } catch (err) {
            console.log('Erro ao deslogar:', err);
        }

        Cookies.remove('nome');
        Cookies.remove('tipo');
        Cookies.remove('usuario_id');
        router.push('/');
    };

    const firstLetter = username ? username.charAt(0).toUpperCase() : '';

    const filteredPages = Object.keys(pageRoutes).filter((page) => {
        if (page === 'Solicitações' && !['admin', 'collaborator'].includes(userType)) {
        return false;
        }
        if (page === 'Serviços' && userType !== 'user') {
        return false;
        }
        return true;
    });


    return (
        <AppBar position="static" sx={{ backgroundColor: '#070E26'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    href="/dashboard"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                    }}
                >
                    <Image src="/images/Favicon.png" alt="Logo do escritório" width={50} height={40} />
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                    {filteredPages.map((page) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    component={Link}
                    href="/dashboard"
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    Escritório Küster
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {filteredPages.map((page) => (
                    <Button
                        key={page}
                        component={Link}
                        href={pageRoutes[page]}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page}
                    </Button>
                    ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar sx={{ width: 48, height: 48, color: '#070E26', backgroundColor: '#d3d6d8' }}>{firstLetter}</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                        <MenuItem 
                            key={setting} 
                            onClick={() => handleSettingsClick(setting)}
                        >
                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;