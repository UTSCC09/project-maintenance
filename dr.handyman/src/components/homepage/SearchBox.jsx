import React, { useCallback, useEffect, useRef, useState } from "react"; // styled components
import { H3, Span, H5, H4 } from "components/Typography";
import FlexBox from "components/FlexBox";
import Menu from "components/Menu";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import {
	Box,
	Card,
	MenuItem,
	TextField,
	InputBase,
	Divider,
	Paper,
} from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import Emitter from "@/utils/eventEmitter";
import { useRouter } from "next/router";

export const SearchOutlinedIcon = styled(SearchOutlined)(({ theme }) => ({
	color: theme.palette.grey[600],
	marginRight: 6,
}));

export const SearchResultCard = styled(Card)(() => ({
	position: "absolute",
	top: "100%",
	paddingTop: "0.5rem",
	paddingBottom: "0.5rem",
	width: "100%",
	zIndex: 99,
}));
const DropDownHandler = styled(FlexBox)(({ theme }) => ({
	borderTopRightRadius: 300,
	borderBottomRightRadius: 300,
	whiteSpace: "pre",
	borderLeft: `1px solid ${theme.palette.text.disabled}`,
	[theme.breakpoints.down("xs")]: {
		display: "none",
	},
}));

const SearchBox = () => {
	const [category, setCategory] = useState(0);
	const [resultList, setResultList] = useState([]);
	const parentRef = useRef();
	const [searchText, setSearchText] = useState("");
	const router = useRouter();

	const handleCategoryChange = (cat) => () => {
		setCategory(cat);
	};

	const handleDocumentClick = () => {
		setResultList([]);
	};

	const startSearch = () => {
		if (category === 0) {
			Emitter.emit("cancelHidden");
		}
		if (category === 0 || category === 1 || category === 4) {
			Emitter.emit("searchWorkers", {
				queryText: searchText || (category === 4 ? '   ' : ""),
				sortByDist: category === 4,
			});

			if (category !== 0) {
				Emitter.emit("clearPosts");
			}
		}
		if (category === 0 || category === 2 || category === 3) {
			Emitter.emit("searchPosts", {
				queryText: searchText || (category === 3 ? '   ' : ""),
				sortByDist: category === 3,
			});
			if (category !== 0) {
				Emitter.emit("clearWorkers");
			}
		}
		if (location.pathname !== '/') {
			router.push('/');
		}
	};

	useEffect(() => {
		window.addEventListener("click", handleDocumentClick);
		return () => {
			window.removeEventListener("click", handleDocumentClick);
		};
	}, []);
	const categoryDropdown = (
		<Menu
			direction="left"
			handler={
				<DropDownHandler
					alignItems="center"
					height="100%"
					px={3}
					color="grey.700"
					component={TouchRipple}
				>
					<Box mr={2.5} fontSize={16}>
						{categories[category].label}
					</Box>
					<KeyboardArrowDownOutlined
						fontSize="18px"
						color="inherit"
					/>
				</DropDownHandler>
			}
		>
			{categories.map((item) => (
				<MenuItem
					key={item.value}
					onClick={handleCategoryChange(item.value)}
				>
					{item.label}
				</MenuItem>
			))}
		</Menu>
	);
	return (
		<Box
			position="relative"
			flex="1 1 0"
			flexDirection="row"
			maxWidth="550px"
			mx="auto"
			{...{
				ref: parentRef,
			}}
		>
			<TextField
				variant="outlined"
				placeholder="Searching anything ..."
				fullWidth
				onChange={(e) => setSearchText(event.target.value)}
				InputProps={{
					sx: {
						height: 44,
						borderRadius: "20px",
						paddingRight: 0,
						color: "grey.800",
						overflow: "hidden",
						"&:hover .MuiOutlinedInput-notchedOutline": {
							border: 1,
						},
					},
					startAdornment: (
						<IconButton
							type="submit"
							sx={{ p: "10px" }}
							aria-label="search"
							onClick={startSearch}
						>
							<SearchIcon />
						</IconButton>
					),
					endAdornment: categoryDropdown,
				}}
			/>

			{!!resultList.length && (
				<SearchResultCard elevation={2}>
					{resultList.map((item) => (
						<Link href={`/product/search/${item}`} key={item}>
							<MenuItem
								key={item}
								InputProps={{
									sx: {
										"&:hover ": {
											bgcolor: "#92B6CE",
										},
									},
								}}
							>
								{item}
							</MenuItem>
						</Link>
					))}
				</SearchResultCard>
			)}
		</Box>
	);
};

const categories = [
	{
		label: "All Categories",
		value: 0,
	},
	{
		label: "Handymans",
		value: 1,
	},
	{
		label: "Posts",
		value: 2,
	},
	{
		label: "Posts near me",
		value: 3,
	},
	{
		label: "Handymans near me",
		value: 4,
	},
];

export default SearchBox;
