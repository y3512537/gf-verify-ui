
<template>
	<el-dialog v-model="showImportDialog" title="导入卡密" width="400px" center>
		<el-upload ref="uploadRef" accept="xls,xlsx" :auto-upload="false" drag :action="uploadUrl" name="file" :limit="1" :file-list="fileList">
			<el-icon class="el-icon--upload"><ele-Top/></el-icon>
			<div class="el-upload__text">Drop file here or <em>click to upload</em></div>
		</el-upload>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onCancel" size="default">取 消</el-button>
				<el-button type="primary" @click="onSubmit(uploadRef)" size="default">确 认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { UploadInstance } from 'element-plus';
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue';
export default defineComponent({
	setup() {
		const uploadRef = ref<UploadInstance>()
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			showImportDialog: false,
			uploadUrl: (import.meta.env.VITE_API_URL as any) + 'api/v1/card/import',
			fileList: [],
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
		const openImportDialog = (row: any) => {
      state.fileList = []
			state.ruleForm = { ...row };
			state.showImportDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.showImportDialog = false;
			proxy.$refs.UploadEl.clearFiles();
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		const onSubmit = async (UploadEl: UploadInstance | undefined) => {
			if (!UploadEl) return;
			UploadEl.submit();
			state.showImportDialog = false;
		};
		return {
			openImportDialog,
			onCancel,
			onSubmit,
			uploadRef,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
</style>
