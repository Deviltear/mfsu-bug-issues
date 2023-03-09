/* 物流
 * @Author: ZhangZhaoXiang
 * @Date: 2022-09-09 16:11:31
 * @Last Modified by: ZhangZhaoXiang
 * @Last Modified time: 2022-09-14 15:03:49
 */

import { SelectOptions } from '.';

// 币种
export const CurrencyOptions: SelectOptions[] = [
  {
    label: 'CNY',
    value: 1,
  },
  {
    label: 'USD',
    value: 2,
  },
  {
    label: 'GBP',
    value: 4,
  },
];

export const CurrencyOptionsMap = CurrencyOptions.reduce((preV, curV) => ({ ...preV, [curV.value]: curV.label }), {});

// 费用状态
export const FeeStatusOptions: SelectOptions[] = [
  {
    label: '对账中',
    value: 1,
  },
  {
    label: '已对账',
    value: 2,
  },
];
