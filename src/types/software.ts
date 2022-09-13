// 定义接口来定义对象的类型
export interface SoftwareState {
	isShowDialog: boolean;
	ruleForm: {
		softwareName: string;
		softwareStatus: number;
		cardLength: number;
		keyPrefix: string;
		multiOnline: number;
		isReplace: number;
		heartbeat: number;
		openTrial: number;
		trialCount: number;
		trialTime: number;
		trialDuration: number;
		comment: string;
	};
}
export interface SoftwareRow {
	id:number;
  softwareName: string;
  softwareStatus: number;
  cardLength: number;
  keyPrefix: string;
  multiOnline: number;
  isReplace: number;
  heartbeat: number;
  openTrial: number;
  trialCount: number;
  trialTime: number;
  trialDuration: number;
  comment: string;
}