import { useState } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	Snackbar,
	Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
// import blackHole from '../../public/assets/black-hole.jpg';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [openSnack, setOpenSnack] = useState(false);
	const [openSnackError, setOpenSnackError] = useState(false);

	const navigate = useNavigate();

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnack(false);
		setOpenSnackError(false);
	};

	const onSubmit = async () => {
		try {
			const myObject = {
				name: username,
				password: password,
			};

			const {
				data,
			}: AxiosResponse<{
				id: string;
				name: string;
				password: string;
			}> = await axios.post(process.env.REACT_APP_URL + 'user/login', myObject);

			localStorage.setItem('user-logado', JSON.stringify(data.id));

			setMessage('Conta logada com sucesso');
			setOpenSnack(true);
			window.setTimeout(() => navigate('/tasklist'), 4000);
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setMessage(error.response!.data.error);
			setOpenSnackError(true);
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				sx={{
					flexDirection: { xs: 'column', md: 'row' },
				}}
			>
				<Box
					display="flex"
					sx={{
						backgroundImage: `url(assets/webb-image.webp)`,
						backgroundSize: 'cover',
						width: '70%',
						height: { md: '100vh' },
						paddingLeft: '0',
					}}
				></Box>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					width="100vw"
					maxWidth="20rem"
					gap="1.5rem"
					height="95vh"
					paddingX="3%"
				>
					<Typography variant="h1" className="text-[2rem] font-bold">
						Login
					</Typography>
					<TextField
						id="outlined-name"
						label="Username"
						variant="standard"
						fullWidth
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						id="outlined-password"
						label="Password"
						variant="standard"
						type="password"
						fullWidth
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button
						variant="contained"
						className="text-[1rem] rounded"
						fullWidth
						onClick={onSubmit}
					>
						LOGIN
					</Button>
					<Typography className="text-[1rem]">Or Sing Up Using</Typography>
					<Link to={'/signup'}>
						<Button variant="text">SIGN UP</Button>
					</Link>
				</Box>
			</Box>
			<Snackbar open={openSnack} autoHideDuration={6000}>
				<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
			<Snackbar
				open={openSnackError}
				autoHideDuration={5000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</>
	);
}
