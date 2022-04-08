import { useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { TRIGGER_MESSAGE } from "../../store/constants";

let timer = null;

export default () => {
	const globalMessage = useSelector((state) => state.globalMessage);
	const [openStatus, setOpenStatus] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		setOpenStatus(globalMessage.show);

		const clearMessage = () => {
			setOpenStatus(false);
        dispatch({
          type: TRIGGER_MESSAGE,
          payload: {
            globalMessage: {
              show: false,
            },
          },
        });
		}
		if (globalMessage.show) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        clearMessage();
      }, globalMessage.duration)
		}
	}, [globalMessage]);

	return (
		<Snackbar open={openStatus} autoHideDuration={globalMessage.duration}>
			<Alert severity={globalMessage.severity} sx={{ width: "100%" }}>
				{globalMessage.message}
			</Alert>
		</Snackbar>
	);
};
