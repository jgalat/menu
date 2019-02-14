import React from 'react';
import { Paper, Typography, Link } from '@material-ui/core';
import Code from '@material-ui/icons/Code';
import withStyles from '@material-ui/core/styles/withStyles';
import style from '../theme';

function PaperLayout(props) {
	const { classes, children } = props;

	return (
		<React.Fragment>
			<main className={classes.main}>
				<Paper className={classes.paper}>
					{children}
				</Paper>
			</main>
			<footer className={classes.footer}>
				<Typography variant="body1">
					<Link href={'https://github.com/jgalat/menu'} className={classes.link}>
						<Code className={classes.footerText} fontSize="inherit" />
						{' '}
						<span className={classes.footerText}>Source code</span>
					</Link>
				</Typography>
			</footer>
		</React.Fragment>
	);
}

export default withStyles(style)(PaperLayout);
