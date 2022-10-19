import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/tasklist" element={<Tasks />} />
			</Routes>
		</BrowserRouter>
	);
}
