import { useEffect, useState } from 'react';
import {
	Box,
	Modal,
	Button,
	Typography,
	TextField,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Snackbar,
	Alert,
	Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios, { AxiosError, AxiosResponse } from 'axios';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #4d4d4d87',
	boxShadow: 24,
	p: 4,
	gap: 6,
};

type Tasks = {
	id: string;
	description: string;
	detail: string;
	archived: boolean;
};

export default function Tasks() {
	const userID = JSON.parse(localStorage.getItem('user-logado') as string);
	const [tasks, setTasks] = useState<Tasks[]>([]);
	const [tasksArchived, setTasksArchived] = useState<Tasks[]>([]);
	const [task, setTask] = useState<Tasks>();
	const [hasUpdate, setHasUpdate] = useState(true);
	const [description, setDescription] = useState('');
	const [descriptionFilter, setDescriptionFilter] = useState('');
	const [detail, setDetail] = useState('');
	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openArchived, setOpenArchived] = useState(false);
	const [message, setMessage] = useState('');
	const [openSnack, setOpenSnack] = useState(false);
	const [openSnackError, setOpenSnackError] = useState(false);

	const handleOpenCreate = () => setOpenCreate(true);
	const handleCloseCreate = () => setOpenCreate(false);
	const handleCloseEdit = () => setOpenEdit(false);
	const handleCloseDelete = () => setOpenDelete(false);
	const handleCloseArchived = () => setOpenArchived(false);

	useEffect(() => {
		async function getTasks() {
			const { data }: AxiosResponse<Tasks[]> = await axios.get(
				process.env.REACT_APP_URL + `user/${userID}/tasks`
			);

			const notArchived = data.filter((task) => task.archived === false);
			const tasksArchived = data.filter((task) => task.archived === true);
			setTasks(notArchived);
			setTasksArchived(tasksArchived);
		}

		if (hasUpdate) {
			getTasks();
			setHasUpdate(false);
		}
	}, [hasUpdate, userID]);

	function handleOpenToEdit(taskSelect: Tasks) {
		setOpenEdit(true);
		setTask(taskSelect);
	}

	function handleOpenToDelete(taskSelect: Tasks) {
		setOpenDelete(true);
		setTask(taskSelect);
	}

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

	async function createTask() {
		try {
			const taskBody = {
				description,
				detail,
			};
			const response: AxiosResponse<{ tasks: Tasks[] }> = await axios.post(
				process.env.REACT_APP_URL + `user/${userID}/tasks`,
				taskBody
			);
			setHasUpdate(true);
			setMessage('Recado criado');
			setOpenSnack(true);
			handleCloseCreate();
			setDescription('');
			setDetail('');
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setMessage(error.response!.data.error);
			setOpenSnackError(true);
		}
	}

	async function editTask() {
		try {
			if (task) {
				const taskBody = {
					description,
					detail,
				};

				const id = task.id;

				const response: AxiosResponse<{ tasks: Tasks[] }> = await axios.put(
					process.env.REACT_APP_URL + `user/${userID}/tasks/${id}`,
					taskBody
				);
				setHasUpdate(true);
				setMessage('Recado editado');
				setOpenSnack(true);
				handleCloseEdit();
				setDescription('');
				setDetail('');
			}
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setMessage(error.response!.data.error);
			setOpenSnackError(true);
		}
	}

	async function deleteTask() {
		try {
			if (task) {
				const id = task.id;

				const response: AxiosResponse<{ tasks: Tasks[] }> = await axios.delete(
					process.env.REACT_APP_URL + `user/${userID}/tasks/${id}`
				);
				setHasUpdate(true);
				setMessage('Recado deletado');
				setOpenSnackError(true);
				handleCloseDelete();
			}
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setMessage(error.response!.data.error);
			setOpenSnackError(true);
		}
	}

	async function archiveTask(taskSelect: Tasks) {
		try {
			setTask(taskSelect);
			if (task) {
				const taskBody = {
					archived: true,
				};

				const id = task.id;

				const response: AxiosResponse<{ tasks: Tasks[] }> = await axios.put(
					process.env.REACT_APP_URL + `user/${userID}/tasks/${id}/archived`,
					taskBody
				);
				setHasUpdate(true);
				setMessage('Recado arquivado');
				setOpenSnack(true);
				handleCloseArchived();
			}
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setMessage(error.response!.data.error);
			setOpenSnackError(true);
		}
	}

	async function unarchiveTask(taskSelect: Tasks) {
		try {
			setTask(taskSelect);
			if (task) {
				const taskBody = {
					archived: false,
				};

				const id = task.id;

				const response: AxiosResponse<{ tasks: Tasks[] }> = await axios.put(
					process.env.REACT_APP_URL + `user/${userID}/tasks/${id}/archived`,
					taskBody
				);
				setHasUpdate(true);
				setMessage('Recado desarquivado');
				setOpenSnack(true);
				handleCloseArchived();
			}
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setMessage(error.response!.data.error);
			setOpenSnackError(true);
		}
	}
	return (
		<>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				className="py-3"
			>
				<Box
					className=" border-2 border-solid rounded-md p-5"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					width="100vw"
					maxWidth="28rem"
					gap="0.4rem"
				>
					<Button
						onClick={handleOpenCreate}
						variant="contained"
						className="rounded-full self-end"
					>
						recado +
					</Button>
					<Typography
						variant="h1"
						className="text-[2rem] text-slate-800 font-extrabold"
					>
						Lista de <span className="text-orange-600">Recados</span>
					</Typography>
					{tasks.length < 1 ? (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							sx={{
								backgroundImage: `url(assets/webb-image.webp)`,
								backgroundSize: 'cover',
								width: '75%',
								height: '200px',
							}}
						>
							<Typography color="#fff" variant="h5">
								Sem recados
							</Typography>
						</Box>
					) : (
						<TableContainer component={Paper}>
							<Table
								sx={{ minWidth: 400 }}
								size="medium"
								aria-label="a dense table"
							>
								<TableHead>
									<TableRow>
										<TableCell>Descrição</TableCell>
										<TableCell>Detalhamento</TableCell>
										<TableCell>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{tasks.map((row: Tasks) => {
										return (
											<TableRow key={row.id}>
												<TableCell>{row.description}</TableCell>
												<TableCell>{row.detail}</TableCell>
												<TableCell align="center">
													<Box>
														<Tooltip title="Delete">
															<IconButton
																aria-label="Remover"
																onClick={() => handleOpenToDelete(row)}
															>
																<DeleteIcon color="error" />
															</IconButton>
														</Tooltip>
														<Tooltip title="Editar">
															<IconButton
																aria-label="edit"
																onClick={() => handleOpenToEdit(row)}
															>
																<EditIcon color="primary" />
															</IconButton>
														</Tooltip>
														<Tooltip title="Arquivar">
															<IconButton
																aria-label="archive"
																onClick={() => archiveTask(row)}
															>
																<ArchiveIcon color="secondary" />
															</IconButton>
														</Tooltip>
													</Box>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
							<Button
								onClick={() => setOpenArchived(true)}
								variant="text"
								className="rounded-full mt-2"
							>
								Filtrar
							</Button>
						</TableContainer>
					)}
					<Button
						onClick={() => setOpenArchived(true)}
						variant="text"
						className="rounded-full mt-2"
					>
						Arquivados
					</Button>
				</Box>
			</Box>
			<Modal
				open={openCreate}
				onClose={handleCloseCreate}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						variant="h1"
						className="text-[2rem] self-start text-slate-800 font-extrabold"
					>
						Adicionar <span className="text-orange-600">recado</span>
					</Typography>
					<TextField
						id="outlined-description"
						label="Descrição"
						variant="standard"
						fullWidth
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<TextField
						id="outlined-detail"
						label="Detalhamento"
						variant="standard"
						fullWidth
						value={detail}
						onChange={(e) => setDetail(e.target.value)}
					/>
					<Button
						variant="contained"
						className="text-[1rem] rounded-full mt-3 w-full"
						onClick={createTask}
					>
						SALVAR
					</Button>
				</Box>
			</Modal>
			<Modal
				open={openDelete}
				onClose={handleCloseDelete}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						variant="h1"
						className="text-[2rem] self-start text-slate-800 font-extrabold"
					>
						Apagar <span className="text-orange-600">recado</span>
					</Typography>
					<Box display="flex" gap="10px">
						<Button
							variant="contained"
							className="text-[1rem] rounded-full mt-3 w-full"
							onClick={deleteTask}
						>
							APAGAR
						</Button>
						<Button
							variant="outlined"
							className="text-[1rem] rounded-full mt-3 w-full"
							onClick={handleCloseDelete}
						>
							Sair
						</Button>
					</Box>
				</Box>
			</Modal>
			<Modal
				open={openEdit}
				onClose={handleCloseEdit}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						variant="h1"
						className="text-[2rem] self-start text-slate-800 font-extrabold"
					>
						Editar <span className="text-orange-600">recado</span>
					</Typography>
					<TextField
						id="outlined-description"
						label="Descrição"
						variant="standard"
						fullWidth
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<TextField
						id="outlined-detail"
						label="Detalhamento"
						variant="standard"
						fullWidth
						value={detail}
						onChange={(e) => setDetail(e.target.value)}
					/>
					<Button
						variant="contained"
						className="text-[1rem] rounded-full mt-3 w-full"
						onClick={editTask}
					>
						EDITAR
					</Button>
				</Box>
			</Modal>
			<Modal
				open={openArchived}
				onClose={handleCloseArchived}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					{tasksArchived.length < 1 ? (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							sx={{
								backgroundImage: `url(assets/webb-image.webp)`,
								backgroundSize: 'cover',
								width: '75%',
								height: '200px',
							}}
						>
							<Typography color="#fff" variant="h5">
								Sem recados
							</Typography>
						</Box>
					) : (
						<TableContainer component={Paper}>
							<Table
								sx={{ minWidth: 400 }}
								size="medium"
								aria-label="a dense table"
							>
								<TableHead>
									<TableRow>
										<TableCell>Descrição</TableCell>
										<TableCell>Detalhamento</TableCell>
										<TableCell>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{tasksArchived.map((row: Tasks) => {
										return (
											<TableRow key={row.id}>
												<TableCell>{row.description}</TableCell>
												<TableCell>{row.detail}</TableCell>
												<TableCell align="center">
													<Box>
														<Tooltip title="Desarquivar">
															<IconButton
																aria-label="archive"
																onClick={() => unarchiveTask(row)}
															>
																<UnarchiveIcon color="success" />
															</IconButton>
														</Tooltip>
													</Box>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Box>
			</Modal>
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
