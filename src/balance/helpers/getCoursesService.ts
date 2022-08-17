import axios from 'axios';

export const getCoursesService = async (base: string, currency: string) => {
  const courses = await axios
    .get(
      `https://exchange-rates.abstractapi.com/v1/live/?api_key=10911728664e4bc49031b27ca146ca51&base=${base}&target=${currency}`,
    )
    .then(res => res.data)
    .catch(error => {
      //   console.log(error);
      return error.code;
    });
  return courses;
};
