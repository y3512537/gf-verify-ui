export interface CardState {
	isShowDialog: boolean;
	ruleForm: {
    id?: number;
    softwareId?: string;
    softwareName?: string;
    cardCode?: string;
    cardValue?: number;
    cardType?: string;
    deviceId?: string;
    cardStatus?: number;
    unbindCount?: number;
    genCount: number;
    genTime?: Date;
    activateTime?: Date;
    expireTime?: Date;
    customize?: number;
    keyPrefix?: string;
    multiOnline?: number;
    isReplace?: number;
    comment?: string;
    createTime?: Date;
    updateTime?: Date;
	};
}
