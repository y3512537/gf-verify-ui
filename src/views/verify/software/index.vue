<template>
	<div class="app-container">
		<el-card shadow="always">
			<el-form :model="state.queryParams" ref="queryFormRef" :inline="true">
				<el-form-item label="软件名称" prop="softwareName">
					<el-input placeholder="软件名称模糊查询" size="default" clearable @keyup.enter="handleQuery" style="width: 240px" v-model="state.queryParams.softwareName" />
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
					<el-button size="default" type="primary" @click="onOpenAddSoftware">
						<el-icon>
							<ele-Plus />
						</el-icon>
						新建软件
					</el-button>
				</el-col>
			</el-row>
			<el-table :data="state.tableData" style="width: 100%" height="520">
				<el-table-column fixed prop="softwareName" label="软件名称" width="150" align="center" />
				<el-table-column prop="secretId" label="secretId" align="center" />
				<el-table-column prop="secretKey" label="secretKey" align="center" />
				<el-table-column prop="keyPrefix" label="卡密前缀" align="center" />
				<el-table-column prop="softwareStatus" label="软件状态" align="center">
					<template #default="scope">
            <DictTag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.softwareStatus"/>
					</template>
				</el-table-column>
				<el-table-column prop="multiOnline" label="多开上限" align="center" />
        <el-table-column prop="isReplace" label="顶号登录" align="center" >
          <template #default="scope">
            <DictTag :type="DICT_TYPE.SYS_YES_NO" :value="scope.row.isReplace"/>
          </template>
        </el-table-column>
				<el-table-column prop="heartbeat" label="心跳间隔" align="center" />
        <el-table-column prop="openTrial" label="开启试用" align="center">
          <template #default="scope">
            <DictTag :type="DICT_TYPE.SYS_YES_NO" :value="scope.row.openTrial"/>
          </template>
        </el-table-column>
				<el-table-column prop="comment" label="软件备注" align="center" />
				<el-table-column prop="createdAt" label="创建时间" width="180" align="center" />
				<el-table-column prop="zip" label="操作" align="center">
					<template #default="scope">
						<el-button type="text" @click="onOpenEditSoftware(scope.row)">修改</el-button>
						<el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页设置-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="mt15" :pager-count="5" :page-sizes="[10, 20, 30, 50]" v-model:current-page="state.queryParams.pageIndex" background v-model:page-size="state.queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="state.total"/>
		</el-card>
		<AddSoftware ref="addSoftware" />
		<EditSoftware ref="editSoftware" />
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue';
import { listSoftware, delSoftware } from '/@/api/verify/software';
import AddSoftware from './component/addSoftware.vue';
import EditSoftware from './component/editSoftware.vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { SoftwareRow } from '/@/types/software';
import {useStore} from "/@/store";
import { DICT_TYPE } from '/@/utils/dict'
const addSoftware = ref();
const editSoftware = ref();
const store = useStore();
const queryFormRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
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
		softwareName: undefined,
	},
});

const resetQueryForm = (formEl: FormInstance | undefined) => {
	state.queryParams.pageNum = 1;
	state.queryParams.pageSize = 10;
	formEl?.resetFields();
	handleQuery();
};

/** 查询软件列表 */
const handleQuery = () => {
	state.loading = true;
  console.log(store.state.dict.isSetDict)
	listSoftware(state.queryParams).then((response: any) => {
		state.tableData = response.data.list;
		state.total = response.data.total;
		state.loading = false;
	});
};
/** 修改软件 */
const onOpenEditSoftware = (row: SoftwareRow) => {
	editSoftware.value.openDialog(row);
};

/** 删除软件*/
const handleDelete = (id: number) => {
	state.loading = true;
	ElMessageBox({
		message: '<span style="color:red;font-weight:bold;">删除软件后，所有卡密都将被删除且无法恢复，请谨慎操作!!!<span>',
		title: '删除软件',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		dangerouslyUseHTMLString: true,
		type: 'warning',
	})
		.then(function () {
			state.loading = true;
			delSoftware(id).then((resp: any) => {
				if (resp.code === 0) {
					ElMessage.success('删除成功');
					handleQuery();
				}
			});
		})
	state.loading = false;
};

const handleSizeChange = (val: number) => {
	state.queryParams.pageSize = val;
	handleQuery();
};

const handleCurrentChange = (val: number) => {
	state.queryParams.pageNum = val;
	handleQuery();
};

const onOpenAddSoftware = () => {
	addSoftware.value.openDialog();
};

onMounted(() => {
	handleQuery();
	proxy.mittBus.on('onEditSoftware', () => {
		handleQuery();
	});
});
onUnmounted(() => {
	proxy.mittBus.off('onEditSoftware');
});
</script>
