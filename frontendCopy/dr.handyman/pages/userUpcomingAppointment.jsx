import AppLayout from "components/layout/AppLayout";
import ProfileDashboardLayout from "components/layout/ProfileDashboardLayout";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ProfileDashboardNavigation from "components/profile/ProfileDashboardNav";
import Link from "next/link";
import { Box } from "@mui/system";
import Emitter from "@/utils/eventEmitter";
import { styled } from "@mui/material/styles";
import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import Appointment from "../src/components/appointment/Appointment";
import { H3, Span, H5 } from "components/Typography";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostRow from "components/PostRow";
import {
	GET_UP_COMING_APPOINTMENT,
	GET_UP_COMING_APPOINTMENT_COUNT,
} from "@/GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

const UserUpcomingAppointment = (props) => {
	const [getAppointmentPages, { loading }] = useLazyQuery(
		GET_UP_COMING_APPOINTMENT
	);
	const userData = useSelector((state) => state.userData);
	const [getCount, { loading: cloading }] = useLazyQuery(
		GET_UP_COMING_APPOINTMENT_COUNT
	);
	const [appointmentCount, setAppointmentCount] = useState(0);
	const [appointmentList, setPostData] = useState([]);
	const [page, setPage] = useState(1);
	let index1 = (page - 1) * 6 + 1;
	let index2 = page * 6;
	if (appointmentCount <= page * 6) {
		index2 = appointmentCount;
	}
	if (appointmentCount == 0) {
		index1 = 0;
		index2 = 0;
	}
	useEffect(() => {
		const getUpcomingAppointment = (page = 0) => {
			if (!userData.email) return;
			setPage(page + 1);
			getCount({
				variables: {
					email: userData.email,
				},
			})
				.then((res) => {
					if (res.data) {
						setAppointmentCount(
							res.data.getAppointmentUpComingCount
						);
					}
					if (res.error) {
						Emitter.emit("showMessage", {
							message: res.error,
							severity: "error",
						});
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
			getAppointmentPages({
				variables: {
					email: userData.email,
					appointmentPerPage: 6,
					page,
				},
			})
				.then((res) => {
					if (res.error) {
						Emitter.emit("showMessage", {
							message: res.error,
							severity: "error",
						});
					}
					if (res.data) {
						setPostData(res.data.getAppointmentUpComingPage || []);
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};
		getUpcomingAppointment();
		Emitter.on("updateUpcomingAppointment", getUpcomingAppointment);
	}, [userData]);

	if (loading || cloading) {
		return (
			<NavbarLayout>
				<H3 color="#2C2C2C" mb={2}>
					See my upcoming appointments
				</H3>
				<div>Loading...</div>
			</NavbarLayout>
		);
	}

	const handleChange = (event, value) => {
		Emitter.emit("updateUpcomingAppointment", value - 1);
	};

	return (
		<AppLayout>
			<ProfileDashboardLayout>
				<DashboardPageHeader
					title="My Upcoming Appointment"
					navigation={<ProfileDashboardNavigation />}
				/>

				<NavbarLayout>
					<PostRow
						sx={{
							display: {
								xs: "none",
								md: "flex",
							},
							padding: "0px 18px",
							background: "none",
							bgcolor: "#F7E1A9",
						}}
						elevation={0}
					>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							Information
						</H5>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							With
						</H5>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							StartTime
						</H5>

						<H5
							flex="0 0 0 !important"
							color="grey.600"
							px={2.75}
							py={0.5}
							my={0}
						></H5>
					</PostRow>
					{appointmentList.map((item, ind) => (
						<Appointment appointment={item} key={ind} />
					))}

					<FlexBox
						flexWrap="wrap"
						justifyContent="space-between"
						alignItems="center"
						mt={4}
					>
						<Span color="grey.600">
							Showing {index1}-{index2} of {appointmentCount} { " "}
							Appointments
						</Span>
						<Pagination
							count={Math.ceil(appointmentCount / 6)}
							variant="outlined"
							color="primary"
							onChange={handleChange}
						/>
					</FlexBox>
				</NavbarLayout>
			</ProfileDashboardLayout>
		</AppLayout>
	);
};

const appointmentList = [
	{
		with: "Alice",
		content:
			"this is the conte sdjf jfa dq w qj  nqn nq q; nfqn; fnqn;nnqjfn;jqip f afjn fioaf nt",
		time: "2022-03-21",
		userUrl: "/users/500000",
	},
	{
		with: "Alice",
		content: "this is the  ijaf content",
		time: "2022-03-21",
		userUrl: "/users/500000",
	},
	{
		with: "Alice",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/users/500000",
	},
];

export default UserUpcomingAppointment;
