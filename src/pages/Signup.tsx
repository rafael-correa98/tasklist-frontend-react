import { useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

export default function Signup() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repeatpassword, setRepeatpassword] = useState('');
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
				repeatPassword: repeatpassword,
			};

			await axios.post(process.env.REACT_APP_URL + 'user', myObject);
			setMessage('Conta criada com sucesso');
			setOpenSnack(true);
			window.setTimeout(() => navigate('/login'), 4000);
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			console.log('catch', error.response!.data.error);
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
					flexDirection: { xs: 'column', md: 'row-reverse' },
				}}
			>
				<Box
					display="flex"
					sx={{
						backgroundImage: `url(assets/webb-image.webp)`,
						backgroundSize: 'cover',
						width: '75%',
						height: { md: '100vh' },
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
						Sign up
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
					<TextField
						id="outlined-password-repeat"
						label="Repeat Password"
						variant="standard"
						type="password"
						fullWidth
						value={repeatpassword}
						onChange={(e) => setRepeatpassword(e.target.value)}
					/>
					<Button
						variant="contained"
						className="text-[1rem] rounded"
						fullWidth
						onClick={onSubmit}
					>
						SIGN UP
					</Button>
					<Typography className="text-[1rem] ">
						Already have an account?
					</Typography>
					<Link to={'/login'}>
						<Button variant="text">LOGIN</Button>
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
