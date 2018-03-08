import SparkMD5 from "spark-md5";

export const dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export const blobToDataURL = function(blob, cb) {
    if (typeof (cb) !== 'function') {
        console.log('blobToDataURL has no callback')
        return
    }
    var reader = new FileReader();
    reader.onload = function(e) {cb(e.target.result)};
    reader.readAsDataURL(blob);
}
export const getFileMD5 = function (file, cb) {
    if (typeof (cb) !== 'function') {
        console.log('getFileMD5 has no callback')
        return
    }
    var fileReader = new FileReader(),
        blobSlice =
            File.prototype.mozSlice ||
            File.prototype.webkitSlice ||
            File.prototype.slice,
        chunkSize = 2097152,
        // read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5();
    fileReader.onload = function (e) {
        spark.appendBinary(e.target.result); // append binary string
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            cb(spark.end());
        }
    };
    function loadNext() {
        var start = currentChunk * chunkSize,
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    }
    loadNext();
}