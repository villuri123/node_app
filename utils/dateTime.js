var moment = require('moment-timezone'); // require
moment.tz.setDefault("Asia/Calcutta");
module.exports = {
    getTime: function () {
        return moment().format('HH:mm:ss');
    },
    getDate: function () {
        return moment().format('YYYY-MM-DD');
    },
    getCurrentDateByFormat: function (format) {
        return moment().format(format);
    },
    getDateTime: function () {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    },
    getDiffrence: function (time1, time2) {
        return moment(time1).diff(time2, 'seconds');
    },
    formatDateTime: function (dateTime) {
        return moment(dateTime, "DD-MM-YYYY hh:mm a").format('YYYY-MM-DD HH:mm:ss');
    },
    getDateStartDateTime: function (date) {
        return moment(date, "DD-MM-YYYY").format('YYYY-MM-DD HH:mm:ss');
    },
    getDateEndDateTime: function (date) {
        date = date + " 23:59:59";
        return moment(date, "DD-MM-YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
    },
    addDurationToCurrentDate: function (amount, units) {
        return moment().add(amount, units).format("DD-MM-YYYY");
    },
    isValidDate: function (date, format) {
        return moment(date, format, true).isValid();
    },
    getDateTimeByFormat(date, format) {
        return moment(date, "DD-MM-YYYY hh:mm a").format(format);
    },
    getEndTimeFromDuration(startDateTime, duration) {
        duration = duration.split(":");
        let minutes = (parseInt(duration[0]) * 60) + parseInt(duration[1]);
        let endTime = moment(startDateTime, 'DD-MM-YYYY hh:mm a').add({ minutes: minutes });
        return moment(endTime).format("DD-MM-YYYY hh:mm a");
    },
    getDateIsoDate(date) {
        return moment(date, 'DD-MM-YYYY hh:mm a').toISOString();
    },
    changeISOtoFormat(date, format) {
        return moment(date).format(format);
    }
}; 