export interface SelectOptions {
  label: string;
  value: number | string;
}
// DC出库状态筛选项
export const DC_OutboundStatusOptions: SelectOptions[] = [
  {
    value: 1,
    label: '未出库',
  },
  {
    value: 2,
    label: '部分出库',
  },
  {
    value: 3,
    label: '全部出库',
  },
];

// 物流状态枚举
export const LogisticsStatusOptions: SelectOptions[] = [
  {
    value: 1,
    label: '启运处理',
  },
  {
    value: 20,
    label: '工厂提货',
  },
  {
    value: 25,
    label: '报关装载',
  },
  {
    value: 30,
    label: '开船',
  },
  {
    value: 35,
    label: '到港',
  },
  {
    label: '清关完成',
    value: 40,
  },
  {
    label: '目的港提柜',
    value: 45,
  },
  {
    label: 'DC仓到达',
    value: 50,
  },
  {
    label: '实际送仓',
    value: 55,
  },
  {
    value: 100,
    label: 'DC处理',
  },
  {
    value: 110,
    label: 'DC在途',
  },
  {
    value: 120,
    label: '物流完成',
  },
];

// 不同箱型的体积
export const containerVolumeMap = {
  1: 28, // 20GP
  2: 58, // 40GP
  3: 68, // 40HQ
  4: 86, // 45HQ
};
