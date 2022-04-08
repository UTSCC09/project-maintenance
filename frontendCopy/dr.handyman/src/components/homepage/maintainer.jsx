import FlexBox from "components/FlexBox";
import { H3, Span } from "components/Typography";
import Call from "@mui/icons-material/Call";
import East from "@mui/icons-material/East";
import Place from "@mui/icons-material/Place";
import {
	alpha,
	Avatar,
	Card,
	IconButton,
	Rating,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import React from "react";
import { IMAGE_URL } from "@/constant";

const Maintainer = ({ username, rating, phone, email, distance, _id, commentCount }) => {
	return (
		<Card>
			<Box
				sx={{
					color: "#373737",
					p: "17px 30px 56px",
					bgcolor: "#BDDDEA",
					"&:hover": {
						bgcolor: "#AEC5F2",
					},
				}}
			>
				<H3 fontWeight="600" mb={1}>
					{username}
				</H3>

				<Rating
					value={rating || 0}
					color="warn"
					size="small"
					readOnly
					sx={{
						mb: "0.75rem",
					}}
				/>
					<Span color="#616161" ml={1}>
						({commentCount})
					</Span>
        
				<FlexBox mb={1}>
					<Place
						fontSize="small"
						sx={{
							fontSize: "18px",
							mt: "3px",
						}}
					/>
					{distance !== null && (
						<Span color="secondary" ml={1.5}>
							{distance.toFixed(2) || "N/A"} KM
						</Span>
					)}

					{distance === null && (
						<Span color="secondary" ml={1.5}>
							{Math.ceil(distance) || "N/A"} KM
						</Span>
					)}
				</FlexBox>

				<FlexBox>
					<Call
						fontSize="small"
						sx={{
							fontSize: "18px",
							mt: "2px",
						}}
					/>
					<Span color="#616161" ml={1.5}>
						{phone}
					</Span>
				</FlexBox>
			</Box>

			<FlexBox pl="30px" pr={1} justifyContent="space-between">
				<Avatar
					src={`${IMAGE_URL}/${email}`}
					sx={{
						height: 64,
						width: 64,
						mt: "-32px",
						border: "4px solid",
						borderColor: "grey.100",
						bgcolor: "#FFFFFF",
					}}
				/>
				<Link href={`/userProfile?email=${email}`}>
					<a>
						<IconButton
							sx={{
								my: "0.25rem",
							}}
						>
							<East />
						</IconButton>
					</a>
				</Link>
			</FlexBox>
		</Card>
	);
};

export default Maintainer;
