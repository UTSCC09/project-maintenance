import queryString from "query-string";

export const formatTime = (timeStr) => {
    const numberReg = /^\d+$/;
    const targetTimeStr = numberReg.test(timeStr) ? +timeStr : timeStr;
    return timeStr ?
        `${new Date(targetTimeStr).toLocaleDateString("fr-FR")} ${new Date(
				targetTimeStr
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