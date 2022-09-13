<template>
	<div class="system-edit-dic-container">
		<el-dialog title="修改版本" v-model="isShowDialog" width="500px">
			<el-form :model="ruleForm" :rules="rules" size="default" label-width="90px" ref="ruleFormRef">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="所属软件" prop="softwareId">
							<el-select v-model="ruleForm.softwareId" clearable placeholder="please select a software">
								<el-option :label="item.softwareName" :value="item.id" :key="item.id" v-for="item in softwareList" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="版本号" prop="versionNumber">
							<el-input v-model="ruleForm.versionNumber" placeholder="请输入版本号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否发布">
							<el-switch v-model="ruleForm.isPublish" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="存储方式" prop="storeType">
							<el-select v-model="ruleForm.storeType" placeholder="选择一种存储方式">
								<el-option v-for="item in storeTypeList" :key="item.key" :label="item.value" :value="item.key" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.storeType !== '1'">
						<el-form-item label="下载链接" prop="link">
							<el-input v-model="ruleForm.link" placeholder="下载链接" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.storeType === '3'">
						<el-form-item label="网盘密码">
							<el-input v-model="ruleForm.password" placeholder="网盘密码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="版本备注">
							<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" v-model="ruleForm.comment" placeholder="备注" clearable></el-input>
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
	</div>
</template>

<script lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { computed, defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue';
import { addVersion, editVersion } from '/@/api/verify/software';

export default defineComponent({
	name: 'editVersionModule',
	props: ['storeTypes'],
	setup(props) {
		const ruleFormRef = ref<FormInstance>();
		const { proxy } = getCurrentInstance() as any;
		const storeTypeList = computed(() => {
			return props.storeTypes.values;
		});
		const softwareList = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				softwareId: undefined,
				softwareName: undefined,
				id: undefined,
				versionNumber: undefined,
				storeType: '',
				link: '',
				password: undefined,
				isPublish: 1,
				attId: undefined,
				comment: undefined,
				updateTime: undefined,
			},
		});
		const rules = reactive<FormRules>({
			softwareId: [{ required: true, message: '请输入选择一个软件', trigger: 'blur' }],
			versionNumber: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
			storeType: [{ required: true, message: '存储方式不能为空', trigger: 'blur' }],
			link: [{ required: true, message: '下载地址不能为空', trigger: 'blur' }],
		});
		// 打开弹窗
		const openDialog = (list: any, selected: any, row: any) => {
			softwareList.value = list;
			if (selected) {
				state.ruleForm.softwareId = selected;
			}
			if (row) {
				state.ruleForm = { ...row };
				state.ruleForm.storeType = row.storeType + '';	
			}	
			state.isShowDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
			proxy.$refs.ruleFormRef.resetFields();
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			await formEl.validate((valid) => {
				if (!valid) {
					return false;
				}
				if (state.ruleForm.id) {
					editVersion(state.ruleForm).then(() => {
						ElMessage.success('修改成功');
						proxy.mittBus.emit('onEditVersion');
					});
				} else {
					addVersion(state.ruleForm).then(() => {
						ElMessage.success('新增成功');
						proxy.mittBus.emit('onEditVersion');
					});
				}
				closeDialog();
			});
		};
		return {
			rules,
			ruleFormRef,
			storeTypeList,
			softwareList,
			openDialog,
			onSubmit,
			onCancel,
			...toRefs(state),
		};
	},
});
</script>
