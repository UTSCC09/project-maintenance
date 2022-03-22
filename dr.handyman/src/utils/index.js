import queryString from "query-string";

export const formatTime = (timeStr) => {
    return timeStr ?
        `${new Date(+timeStr).toLocaleDateString("fr-FR")} ${new Date(
				+timeStr
		  ).toLocaleTimeString("fr-FR")}` :
        null;
};

export const getUrlQuery = () => {
    return queryString.parse(window.location.search);
};

export const getLocation = () => {
    return new Promise((resolve, reject) => {
        const options = {
            enableHighAccuracy: true,
            maximumAge: 1000,
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (data) => {
                    resolve(data);
                },
                reject,
                options
            );
        }
    });
};