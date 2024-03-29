import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import Maintainer from "./maintainer";
import { H3, Span, H4 } from "components/Typography";
import { Grid, Pagination } from "@mui/material";
import React from "react";
import { useSelector, useStore, useDispatch } from "react-redux";

import {
	SEARCH_WORKER,
	WORKER_COUNT,
	GET_WORKER,
	SEARCH_WORKER_COUNT,
} from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { Query } from "react-query";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Emitter from "@/utils/eventEmitter";
import { useRouter } from "next/router";
import { getLocation } from "@/utils";
import {
	UPDATE_USER_DATA,
	TRIGGER_MESSAGE,
	UPDATE_USER_POSITION,
} from "@/store/constants";

const MaintainerList = () => {
	const userLocation = useSelector((state) => state.userLocation);
	const [workersData, setWorkersData] = useState([]);
	const [workersCount, setWorkersCount] = useState(0);
	const store = useStore();

	const [page, setPage] = useState(1);
	const [getWorkers, { data, loading, error }] = useLazyQuery(GET_WORKER);
	const [getCount, { data: cdata, loading: cloading }] =
		useLazyQuery(WORKER_COUNT);
	const [searchWorker] = useLazyQuery(SEARCH_WORKER);
	const [searchWorkerCount] = useLazyQuery(SEARCH_WORKER_COUNT);
	const [cacheQueryParams, setCacheQueryParams] = useState("");
	const [hiddenTitle, setHiddenTitle] = useState(false);
	const dispatch = useDispatch();

	const authorizePosition = () => {
		return getLocation().then((data) => {
			const coords = data.coords;
			return coords;
		});
	};

	useEffect(() => {
		const getAllList = () => {
			setCacheQueryParams({});
			getCount().then((res) => {
				setWorkersCount(res.data.getWorkerCount);
			});
			getWorkers({
				variables: {
					page: 0,
					workerPerPage: 6,
					coordinates: [
						userLocation.longitude,
						userLocation.latitude,
					],
				},
			}).then((res) => {
				setWorkersData(res.data.getWorkerPage || []);
			});
		};
		getAllList();

		const handlerWorkersSearch = (queryParams) => {
			setHiddenTitle(false);
			const {
				queryText = "",
				sortByDist = false,
				page = 0,
			} = queryParams;
			const handlerSearch = (coords) => {
				setCacheQueryParams(queryParams);
					if (!queryText) return getAllList();
					
					const userLocationNew = store.getState().userLocation;
					searchWorkerCount({
						variables: {
							page,
							workerPerPage: 6,
							queryText,
							sortByDist,
							coordinates: [
								coords.longitude,
								coords.latitude,
							],
						},
					})
						.then((res) => {
							setWorkersCount(
								res.data.searchWorkerPageCount || 0
							);
						})
						.catch((err) => {
							Emitter.emit("showMessage", {
								message: err.message,
								severity: "error",
							});
						});
					searchWorker({
						variables: {
							page,
							workerPerPage: 6,
							queryText,
							sortByDist,
							coordinates: [
								coords.longitude,
								coords.latitude,
							],
						},
					})
						.then((res) => {
							setWorkersData(res.data.searchWorkerPage || []);
						})
						.catch((err) => {
							Emitter.emit("showMessage", {
								message: err.message,
								severity: "error",
							});
						});
					}
					if (sortByDist) {
						authorizePosition().then((coords) => {
							handlerSearch(coords)
						});
					} else {
						const userLocationNew = store.getState().userLocation;
						handlerSearch(userLocationNew)
			}
		};
		Emitter.on("searchWorkers", handlerWorkersSearch);
		Emitter.on("clearWorkers", () => {
			
			setHiddenTitle(true);
			setWorkersData([]);
			setWorkersCount(0);
		});
		Emitter.on("cancelHidden", () => setHiddenTitle(false));
		return () => {
			Emitter.off("searchWorkers", handlerWorkersSearch);
		};
	}, [userLocation]);

	
	if (loading || cloading || data == undefined || cdata == undefined) {
		return (
			<NavbarLayout>
				<H3 color="#2C2C2C" mb={2}>
					See Top Ratest Handymans
				</H3>
				<div>Loading...</div>
			</NavbarLayout>
		);
	}
	let index1 = (page - 1) * 6 + 1;
	let index2 = page * 6;
	if (workersCount <= page * 6) {
		index2 = workersCount;
	}
	if (workersCount == 0) {
		index1 = 0;
		index2 = 0;
	}
	const handleChange = (event, value) => {
		setPage(value);
		if (cacheQueryParams.queryText) {
			return Emitter.emit(
				"searchWorkers",
				Object.assign(cacheQueryParams, { page: value - 1 })
			);
		}
		getWorkers({
			variables: {
				page: value - 1,
				workerPerPage: 6,
				coordinates: [userLocation.longitude, userLocation.latitude],
			},
		}).then((res) => {
			setWorkersData(res.data.getWorkerPage || []);
		});
	};

	return (
		<NavbarLayout>
			{!hiddenTitle && (
				<>
					<H3 color="#2C2C2C" mb={2}>
						See Top Rated Handymans
					</H3>
				
					<Grid container spacing={3}>
						{workersData.map((item, ind) => (
							<Grid item lg={4} sm={6} xs={12} key={ind}>
								<Maintainer {...item} />
							</Grid>
						))}
					</Grid>

					<FlexBox
						flexWrap="wrap"
						justifyContent="space-between"
						alignItems="center"
						mt={4}
					>
						<Span color="grey.600">
							Showing {index1}-{index2} of {workersCount}{" "}
							Handymans
						</Span>
						<Pagination
							count={Math.ceil(workersCount / 6)}
							page={page}
							onChange={handleChange}
							boundaryCount={1}
							siblingCount={1}
							variant="outlined"
							color="primary"
						/>
					</FlexBox>
				</>
			)}
		</NavbarLayout>
	);
};

export default MaintainerList;
