import React, { useState } from 'react';
import { Typography,
	Button,
	FormControl,
	Input,
	InputLabel,
 	Snackbar } from '@material-ui/core';
import Fastfood from '@material-ui/icons/Fastfood';
import { Link, withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import firebase from '../firebase';
import style from '../theme';

function NewOrder(props) {
	const { classes } = props;

	if (!firebase.getCurrentUser()) {
		// not logged in
		props.history.replace('/');
		return null;
	}

	const [openSnack, setOpenSnack] = useState(false);
	const [orderLink, setOrderLink] = useState('');
	const [form, setForm] = useState({
		dayMenu: '',
		pie1: '',
		pie2: '',
		pie3: '',
	});

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<React.Fragment>
			<Fastfood />
			<Typography className={classes.typography} component="h1" variant="h4">
				Create a new order
			</Typography>
			<form className={classes.form} onSubmit={submit}>
				<FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="dayMenu">Menú del día</InputLabel>
					<Input id="dayMenu" name="dayMenu" autoComplete="off" value={form.dayMenu} onChange={handleChange} />
				</FormControl>
				<FormControl margin="normal" fullWidth>
					<InputLabel htmlFor="pie1">Tarta del día 1</InputLabel>
					<Input id="pie1" name="pie1" autoComplete="off" value={form.pie1} onChange={handleChange} />
				</FormControl>
				<FormControl margin="normal" fullWidth>
					<InputLabel htmlFor="pie2">Tarta del día 2</InputLabel>
					<Input id="pie2" name="pie2" autoComplete="off" value={form.pie2} onChange={handleChange} />
				</FormControl>
				<FormControl margin="normal" fullWidth>
					<InputLabel htmlFor="pie3">Tarta del día 3</InputLabel>
					<Input id="pie3" name="pie3" autoComplete="off" value={form.pie3} onChange={handleChange} />
				</FormControl>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}>
					Submit
				</Button>
			</form>
			<Button
				type="button"
				fullWidth
				variant="contained"
				color="secondary"
				className={classes.submit}
				component={Link}
				to="/">
				Go back
			</Button>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				className={classes.snackbar}
				ContentProps={{
					'aria-describedby': 'message-id',
				}}
				message={
					<Typography color="inherit">
						Share this link: <em>{`${window.location.origin}/${orderLink}`}</em>
					</Typography>
				}
				open={openSnack}
				action={
					<Button color="secondary" size="small" onClick={() => props.history.replace(orderLink)}>
						Redirect me
					</Button>
				} />
		</React.Fragment>
	);

	async function submit(e) {
		e.preventDefault();

		const uid = await firebase.createNewOrder(form);

		if (!uid) {
			props.history.replace('/');
			return null;
		}

		setOrderLink(uid);
		setOpenSnack(true);
	}
}

export default withRouter(withStyles(style)(NewOrder));
