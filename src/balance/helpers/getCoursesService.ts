import axios from 'axios';

export const getCoursesService = async () => {
  const courses = await axios
    .get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
    .then(res => res.data)
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  return courses;
};
