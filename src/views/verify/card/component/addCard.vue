<template>
	<div class="edit-card-container">
		<el-dialog title="新增卡密" v-model="isShowDialog" width="500px" destroy-on-close>
			<el-form :model="ruleForm" :rules="rules" size="default" label-width="90px" ref="ruleFormRef">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="选择软件" prop="softwareId">
							<el-select v-model="ruleForm.softwareId" clearable placeholder="please select a software">
								<el-option :label="item.softwareName" :value="item.id" :key="item.id" v-for="item in softwareList" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="卡类" prop="cardType">
							<el-select v-model="ruleForm.cardType" clearable placeholder="please select a software">
								<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in cardTypeList" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="面值" prop="cardValue">
							<el-input-number v-model="ruleForm.cardValue" :min="1" :max="20" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="生成数量" prop="genCount">
							<el-input-number v-model="ruleForm.genCount" :min="1" :max="200" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="自定义配置">
							<el-switch v-model="ruleForm.customize" active-text="是" inactive-text="否" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.customize">
						<el-form-item label="卡密前缀">
							<el-input v-model="ruleForm.keyPrefix" placeholder="请输入卡密前缀" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.customize">
						<el-form-item label="多开上限">
							<el-input-number v-model="ruleForm.multiOnline" :min="1" :max="20" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.customize">
						<el-form-item label="顶号登录">
							<el-switch v-model="ruleForm.isReplace" active-text="是" inactive-text="否" />
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
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">新 增</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog v-model="dialogVisible" :title="`本次生成了${genCount}张卡密`" destroy-on-close width="600px">
			<el-input type="textarea" :rows="genCount > 10 ? 10 : genCount" :value="genList"> </el-input>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="success" @click="onCopyText(genList)">复制&关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { computed, defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue';
import { addCard } from '/@/api/verify/card';
import commonFunction from '/@/utils/commonFunction';

export default defineComponent({
	name: 'addCardModule',
	props: {
		cardTypes: {
			type: Array,
		},
	},
	setup(props) {
		const cardTypeList = computed(() => {
			return props.cardTypes;
		});
		const dialogVisible = ref(false);
		const genList = ref('');
		const genCount = ref(0);
		const ruleFormRef = ref<FormInstance>();
		const { proxy } = getCurrentInstance() as any;
		const { copyText } = commonFunction();
		const softwareList = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				id: undefined,
				softwareId: undefined,
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
		const rules = reactive<FormRules>({
			softwareId: [{ required: true, message: '请选择一个软件', trigger: 'blur' }],
			cardType: [{ required: true, message: '必须选择生成的卡类', trigger: 'blur' }],
		});
		// 打开弹窗
		const openDialog = (list: any, selected: any) => {
			softwareList.value = list;
			if (selected) {
				state.ruleForm.softwareId = selected;
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
		// 新增
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			await formEl?.validate((valid) => {
				if (!valid) {
					return false;
				}
				addCard(state.ruleForm).then((response: any) => {
					closeDialog();
					if (response.code === 0) {
						genList.value = '';
						genCount.value = 0;
						ElMessage.success('新增成功');
						let list = response.data.list;
						genCount.value = list.length;
						list.forEach((item: string) => {
							genList.value += item + '\n';
						});
						dialogVisible.value = true;
						proxy.mittBus.emit('onEditCard');
					}
				});
			});
		};
		const onCopyText = (text: string) => {
			copyText(text);
			dialogVisible.value = false;
		};
		return {
			cardTypeList,
			rules,
			ruleFormRef,
			dialogVisible,
			softwareList,
			genList,
			genCount,
			onCopyText,
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>
