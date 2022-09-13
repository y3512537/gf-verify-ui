
<template>
	<el-dialog v-model="showPulsDialog" :title="`编辑卡密:${ruleForm.cardCode}`" width="500px">
		<el-form :model="ruleForm" size="default" label-width="90px" ref="ruleFormRef">
			<el-row :gutter="35">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="所属软件" prop="softwareId">
						<el-select v-model="ruleForm.softwareId" clearable placeholder="please select a software" disabled>
							<el-option :label="ruleForm.softwareName" :value="ruleForm.softwareId" :key="ruleForm.softwareId" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="卡密状态" prop="cardStatus">
            <el-switch v-model="ruleForm.cardStatus" active-text="正常" inactive-text="冻结" :active-value="1" :inactive-value="0" />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="到期时间" prop="expireTime">
						<el-date-picker v-model="ruleForm.genTime" type="datetime" placeholder="到期时间" />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="自定义配置" prop="customize">
						<el-switch v-model="ruleForm.customize" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.customize">
					<el-form-item label="多开上限">
						<el-input-number v-model="ruleForm.multiOnline" :min="1" :max="20" />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.customize">
					<el-form-item label="顶号登录">
						<el-switch v-model="ruleForm.isReplace" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="备注">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" v-model="ruleForm.comment" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onCancel" size="default">取 消</el-button>
				<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">确 认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { ElMessage, FormInstance } from 'element-plus';
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue';
import { editCard } from '/@/api/verify/card';
export default defineComponent({
	setup() {
		const ruleFormRef = ref<FormInstance>();
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			showPulsDialog: false,
			ruleForm: {
				id: undefined,
				softwareId: undefined,
				softwareName: undefined,
				cardCode: undefined,
				cardValue: 1,
				cardType: '4',
				deviceId: undefined,
				cardStatus: undefined,
				unbindCount: undefined,
				genCount: 1,
				genTime: undefined,
				activateTime: undefined,
				expireTime: undefined,
				customize: undefined,
				keyPrefix: undefined,
				multiOnline: 1,
				isReplace: undefined,
				comment: undefined,
			},
		});
		const openPulsDialog = (row: any) => {
			state.ruleForm = { ...row };
			state.showPulsDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.showPulsDialog = false;
			proxy.$refs.ruleFormRef.resetFields();
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl?.validate((valid) => {
				if (!valid) {
					return false;
				} else {
					editCard(state.ruleForm).then(() => {
						closeDialog();
						ElMessage.success('修改成功');
					});
				}
			});
		};
		return {
			openPulsDialog,
			onCancel,
			onSubmit,
			ruleFormRef,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
</style>