export const getBlobDuration = async (buffer: Buffer) => {
    const { getVideoDurationInSeconds } = require('get-video-duration')
    const { Readable } = require('stream');

    const stream = Readable.from(buffer);

    await getVideoDurationInSeconds(stream)
        .then((duration: any) => {
            return duration;
        });
}

