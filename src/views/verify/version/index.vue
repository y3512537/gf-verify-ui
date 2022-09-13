<template>
	<div class="app-container">
		<el-card shadow="always">
			<el-form :model="state.queryParams" ref="queryFormRef" :inline="true">
				<el-form-item label="软件名称" prop="softwareName">
					<el-select v-model="state.queryParams.softwareId" clearable placeholder="please select a software" size="default">
						<el-option :label="item.softwareName" :value="item.id" :key="item.id" v-for="item in softwareList" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="default" type="primary" @click="handleQuery">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="default" type="success" @click="resetQueryForm(queryFormRef)">
						<el-icon>
							<ele-RefreshRight />
						</el-icon>
						重置
					</el-button>
				</el-form-item>
				<el-form-item />
			</el-form>
			<!--操作按钮-->
			<el-row :gutter="10" custom-class="mb8">
				<el-col :span="1.5">
					<el-button size="default" type="primary" @click="onOpenAddVersion">
						<el-icon>
							<ele-Plus />
						</el-icon>
						新建版本
					</el-button>
				</el-col>
			</el-row>
			<br />
			<el-table :data="state.tableData" style="width: 100%" height="520" size="default">
				<el-table-column prop="softwareName" label="所属软件" align="center" width="100" />
				<el-table-column prop="versionNumber" label="版本号" align="center" />
				<el-table-column prop="isPublish" label="是否发布" align="center">
					<template #default="scope">
						<span>{{ scope.row.isPublish == 1 ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="link" label="链接" align="center"> </el-table-column>
				<el-table-column prop="storeType" label="存储类型" align="center">
					<template #default="scope">
						<span>{{ fileterStoreTypes(scope.row.storeType) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="updatedAt" label="更新时间" align="center" width="160" />
				<el-table-column prop="comment" label="备注" align="center" />
				<el-table-column prop="zip" label="操作" align="center" width="250">
					<template #default="scope">
						<el-button type="primary" size="small" @click="onOpenEditVersion(scope.row)">编辑</el-button>
						<el-button size="small" @click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页设置-->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30, 50]"
				v-model:current-page="state.queryParams.pageIndex"
				background
				v-model:page-size="state.queryParams.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.total"
			>
			</el-pagination>
		</el-card>
		<EditVersion ref="editVersion" :storeTypes="storeTypeList" />
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { delVersion, listVersion } from '/@/api/verify/version';
import { listSoftware } from '/@/api/verify/software';
import EditVersion from './component/editVersion.vue';
import { getDicts } from '/@/api/system/dict/data';
import { DICT_TYPE } from '/@/utils/dict';
import { DictDataRow } from '/@/types/version';
const editVersion = ref();
const queryFormRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const softwareList: any = ref();
const storeTypeList: Array<DictDataRow> = reactive([]);
const state = reactive({
	// 遮罩层
	loading: true,
	// 弹出层标题
	title: '',
	//分页
	total: 1,
	//列表数据
	tableData: [],
	// 查询参数
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		softwareId: undefined,
		cardCode: undefined,
	},
});

const resetQueryForm = (formEl: FormInstance | undefined) => {
	state.queryParams.pageNum = 1;
	state.queryParams.pageSize = 10;
	formEl?.resetFields();
	state.queryParams.softwareId = undefined
	handleQuery();
};

const getSoftwareList = () => {
	let params = {
		pageIndex: 1,
		pageSize: 10,
	};
	state.loading = true;
	listSoftware(params).then((response: any) => {
		softwareList.value = response.data.list;
		state.loading = false;
	});
};

/** 查询版本列表 */
const handleQuery = () => {
	state.loading = true;
	listVersion(state.queryParams).then((response: any) => {
		state.tableData = response.data.list;
		state.total = response.data.total;
		state.loading = false;
	});
};

const fileterStoreTypes = (value: any) => {
	let storeType = storeTypeList.values.find((storeType: any) => {
		return storeType.key == value;
	});
	if (storeType) {
		return storeType.value;
	}
	return '';
};

/** 删除版本*/
const handleDelete = (row: any) => {
	ElMessageBox({
		message: '是否确认删除版本：' + row.versionNumber,
		title: '警告',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(function () {
		state.loading = true;
		delVersion(row.id).then((resp: any) => {
			if (resp.code === 0) {
				ElMessage.success('删除成功');
				handleQuery();
			}
			state.loading = false;
		});
	});
};

const handleSizeChange = (val: number) => {
	state.queryParams.pageSize = val;
	handleQuery();
};

const handleCurrentChange = (val: number) => {
	state.queryParams.pageNum = val;
	handleQuery();
};

const onOpenAddVersion = () => {
	editVersion.value.openDialog(softwareList.value, state.queryParams.softwareId);
};

const onOpenEditVersion = (row: any) => {
	editVersion.value.openDialog(softwareList.value, state.queryParams.softwareId, row);
};

const getStoreTypeList = () => {
	getDicts(DICT_TYPE.VERIFY_VERISON_STORE_TYPE).then((res: any) => {
		if (res.code === 0) {
			storeTypeList.values = storeTypeList.concat(res.data.values);
		}
	});
};

onMounted(() => {
	getStoreTypeList();
	getSoftwareList();
	handleQuery();
	proxy.mittBus.on('onEditVersion', () => {
		handleQuery();
	});
});
onUnmounted(() => {
	proxy.mittBus.off('onEditVersion');
});
</script>
