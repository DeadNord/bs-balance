import axios from 'axios';
import { CurrencyDto } from '../dto/currency.dto';

// For You :)
// Instead of ENV
const EXCHANGE_RATES_API_KEY = '10911728664e4bc49031b27ca146ca51';

export const getCoursesService = async (
  base: string,
  currency: CurrencyDto,
) => {
  const courses = await axios
    .get(
      `https://exchange-rates.abstractapi.com/v1/live/?api_key=${EXCHANGE_RATES_API_KEY}&base=${base}&target=${currency}`,
    )
    .then(res => res.data)
    .catch(error => {
      //   console.log(error);
      return error.code;
    });
  return courses;
};
