<template>
	<div class="add-software-container">
		<el-dialog title="新建软件" v-model="isShowDialog" width="500px">
			<el-form :model="ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="软件名称">
							<el-input v-model="ruleForm.softwareName" placeholder="请输入软件名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="卡密前缀">
							<el-input v-model="ruleForm.keyPrefix" placeholder="请输入卡密前缀" clearable/>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="卡密长度">
              <el-input-number v-model="ruleForm.cardLength" :min="10" :max="32" />
            </el-form-item>
          </el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="软件状态">
							<el-switch v-model="ruleForm.softwareStatus" active-text="启用" inactive-text="冻结" />
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
							<el-switch v-model="ruleForm.isReplace" active-text="是" inactive-text="否" />
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="开启试用">
							<el-switch v-model="ruleForm.openTrial" active-text="是" inactive-text="否" />
						</el-form-item>
					</el-col>
					<div v-if="ruleForm.openTrial">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
							<el-form-item label="试用时间">
								<el-input v-model="ruleForm.trialTime" placeholder="请输入卡密前缀" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
							<el-form-item label="试用间隔">
								<el-input v-model="ruleForm.trialDuration" placeholder="请输入卡密前缀" clearable></el-input>
							</el-form-item>
						</el-col>
					</div>
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
					<el-button type="primary" @click="onSubmit" size="default">新 增</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, toRefs, defineComponent, getCurrentInstance } from 'vue';
import {addSoftware} from '/@/api/verify/software'
import {SoftwareState} from '/@/types/software';


export default defineComponent({
	name: 'addSoftware',
	setup() {
    const { proxy } = getCurrentInstance() as any;
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
		// 打开弹窗
		const openDialog = () => {
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
		const onSubmit = async () => {
      state.isShowDialog = true;
      await addSoftware(state.ruleForm);
      proxy.mittBus.emit("onEditSoftware");
      state.isShowDialog = false;
      ElMessage.success("新增成功");
			closeDialog();
		};
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.add-software-container {
	.menu-data-tree {
		border: var(--el-input-border, var(--el-border-base));
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
