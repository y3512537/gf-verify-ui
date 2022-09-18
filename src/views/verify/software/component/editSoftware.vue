<template>
	<div class="system-edit-dic-container">
		<el-dialog title="修改软件" v-model="isShowDialog" width="500px">
			<el-form :model="ruleForm" :rules="rules" size="default" label-width="90px" ref="editFormRef">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="软件名称" prop="softwareName">
							<el-input v-model="ruleForm.softwareName" placeholder="请输入软件名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="卡密前缀">
							<el-input v-model="ruleForm.keyPrefix" placeholder="请输入卡密前缀" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="软件状态">
							<el-switch v-model="ruleForm.softwareStatus" active-text="启用" inactive-text="禁用" :active-value="1" :inactive-value="0"/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="多开上限">
							<el-input-number v-model="ruleForm.multiOnline" :min="1" :max="20" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="心跳间隔">
							<el-input-number v-model="ruleForm.heartbeat" :min="1" :max="20" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="顶号登录">
							<el-switch v-model="ruleForm.isReplace" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="开启试用">
							<el-switch v-model="ruleForm.openTrial" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.openTrial">
						<el-form-item label="试用时间">
							<el-input v-model="ruleForm.trialTime" placeholder="请输入卡密前缀" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.openTrial">
						<el-form-item label="试用间隔">
							<el-input v-model="ruleForm.trialDuration" placeholder="请输入卡密前缀" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="软件备注">
							<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" v-model="ruleForm.comment" placeholder="请输入卡密前缀" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(editFormRef)" size="default">修 改</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, toRefs, defineComponent, getCurrentInstance, ref } from 'vue';
import { SoftwareRow, SoftwareState } from '/@/types/software';
import {editSoftware} from '/@/api/verify/software'

export default defineComponent({
	name: 'editSoftware',
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const editFormRef = ref<FormInstance>();
		const state = reactive<SoftwareState>({
			isShowDialog: false,
			ruleForm: {
				softwareName: '',
				softwareStatus: 1,
				cardLength: 10,
				keyPrefix: '',
				multiOnline: 1,
				isReplace: 0,
				heartbeat: 5,
				openTrial: 0,
				trialCount: 1,
				trialTime: 30,
				trialDuration: 1440,
				comment: '',
			},
		});
		const rules = reactive<FormRules>({
			softwareName: [{ required: true, message: '请输入软件名称', trigger: 'blur' }],
		});
		// 打开弹窗
		const openDialog = (row: SoftwareRow) => {
			state.ruleForm = {...row};
			state.isShowDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 新增
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			await formEl?.validate((valid) => {
				if (!valid) {
					return false;
				}
				editSoftware(state.ruleForm).then((response:any) => {
					if (response.code === 0) {
						ElMessage.success("修改成功");
						proxy.mittBus.emit("onEditSoftware");
					}
				});
				closeDialog();
			});

		};
		return {
			openDialog,
			closeDialog,
			rules,
			editFormRef,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>
