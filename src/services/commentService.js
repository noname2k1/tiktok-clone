import * as httpRequest from '~/utils/httpRequest';

const getComments = async (videoID) => {
    try {
        const res = await httpRequest.get(`videos/${videoID}/comments`, {
            headers: {
                Authorization:
                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aWt0b2suZnVsbHN0YWNrLmVkdS52blwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTY3MzE2Mzk3MiwiZXhwIjoxNjc1NzU1OTcyLCJuYmYiOjE2NzMxNjM5NzIsImp0aSI6IjFPMTRoYTBYczY0QXF3UmMiLCJzdWIiOjQ4MTMsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ._MrzvqGPGHhh4V22YWkAbbGafWwGakfuiGu_vfq6VCo',
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export { getComments };
