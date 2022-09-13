<template>
	<div class="app-container">
		<el-card shadow="always">
			<el-form :model="state.queryParams" ref="queryFormRef" :inline="true">
				<el-form-item label="软件名称" prop="softwareName">
					<el-select v-model="state.queryParams.softwareId" clearable placeholder="please select a software" size="default">
						<el-option :label="item.softwareName" :value="item.id" :key="item.id" v-for="item in softwareList" />
					</el-select>
				</el-form-item>
				<el-form-item label="卡密" prop="cardCode">
					<el-input
						placeholder="输入卡密支持模糊查询"
						size="default"
						clearable
						@keyup.enter="handleQuery"
						style="width: 240px"
						v-model="state.queryParams.cardCode"
					/>
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
					<el-button size="default" type="primary" @click="onOpenAddCard">
						<el-icon>
							<ele-Plus />
						</el-icon>
						新建卡密
					</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button size="default" type="primary" @click="onOpenImportCard">
						<el-icon>
							<ele-Upload />
						</el-icon>
						导入
					</el-button>
				</el-col>
			</el-row>
			<br />
			<el-table :data="state.tableData" style="width: 100%" height="520" size="default">
				<el-table-column fixed prop="cardCode" label="卡密" width="250" align="center" />
				<el-table-column prop="softwareName" label="所属软件" align="center" width="100" />
				<el-table-column prop="cardValue" label="面值" align="center">
					<template #default="scope">
						<span>{{ scope.row.cardValue }} {{ fileterCardType(scope.row.cardType) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="cardStatus" label="状态" align="center">
					<template #default="scope">
						<span>{{ scope.row.cardStatus == 1 ? '正常' : '冻结' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="multiOnline" label="多开上限" align="center"> </el-table-column>
				<el-table-column prop="isReplace" label="顶号" align="center">
					<template #default="scope">
						<span>{{ scope.row.isReplace == 1 ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="genTime" label="生成时间" align="center" width="150" />
				<el-table-column prop="activateTime" label="激活时间" align="center" width="150" />
				<el-table-column prop="expireTime" label="到期时间" align="center" width="150" />
				<el-table-column prop="comment" label="备注" align="center" />
				<el-table-column prop="zip" label="操作" align="center" width="250">
					<template #default="scope">
						<el-button type="primary" size="small" @click="onEditCard(scope.row)">编辑</el-button>
						<!-- <el-button size="small" @click="handleDelete(scope.row)">删除</el-button> -->
						<el-dropdown style="margin-left: 10px" split-button type="primary" size="small">
							更多
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="quickRecharge(scope.row)">快捷续费</el-dropdown-item>
									<el-dropdown-item @click="onFreezeCard(scope.row)">冻结卡密</el-dropdown-item>
									<el-dropdown-item @click="handleDelete(scope.row)">删除卡密</el-dropdown-item>
									<el-dropdown-item @click="onUnbindCard(scope.row)">解绑卡密</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
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
		<AddCard ref="addCard" :cardTypes="cardTypeList" />
		<EditCard ref="editCard"/>
		<ImportCard ref="importCard" />
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue';
import { listCard, delCard, quickRechargeCard, freezeCard, unbindCard } from '/@/api/verify/card';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { listSoftware } from '/@/api/verify/software';
import AddCard from './component/addCard.vue';
import EditCard from './component/editCard.vue';
import ImportCard from './component/importCard.vue';
const addCard = ref();
const editCard = ref();
const importCard = ref();
const queryFormRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const cardTypeList = reactive([
	{ label: '分钟卡', value: '1' },
	{ label: '小时卡', value: '2' },
	{ label: '天卡', value: '3' },
	{ label: '月卡', value: '4' },
	{ label: '季卡', value: '5' },
	{ label: '半年卡', value: '6' },
	{ label: '年卡', value: '7' },
]);
const softwareList: any = ref();
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

const fileterCardType = (value: any) => {
	let cardType = cardTypeList.filter((cardType) => {
		return cardType.value == value;
	});
	if (cardType && cardType.length > 0) {
		return cardType[0].label.substring(0, cardType[0].label.length - 1);
	}
};

const resetQueryForm = (formEl: FormInstance | undefined) => {
	state.queryParams.pageNum = 1;
	state.queryParams.pageSize = 10;
	formEl?.resetFields();
	state.queryParams.softwareId = undefined
	handleQuery();
};

const getSoftwareList = () => {
	let params = {
		pageNum: 1,
		pageSize: 10,
	};
	state.loading = true;
	listSoftware(params).then((response: any) => {
		softwareList.value = response.data.list;
		state.loading = false;
	});
};

/** 查询卡密列表 */
const handleQuery = () => {
	state.loading = true;
	listCard(state.queryParams).then((response: any) => {
		state.tableData = response.data.list;
		state.total = response.data.total;
		state.loading = false;
	});
};

/** 删除卡密*/
const handleDelete = (row: any) => {
	ElMessageBox({
		message: '是否确认删除卡密：' + row.cardCode,
		title: '警告',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(function () {
		state.loading = true;
		delCard(row.id).then((resp: any) => {
			if (resp.code === 0) {
				ElMessage.success('删除成功');
				handleQuery();
			}
			state.loading = false;
		});
	});
};

const quickRecharge = (row: any) => {
	if (!row.activateTime) {
		ElMessage.warning('该卡尚未激活');
		return false;
	}
	let cardType = fileterCardType(row.cardType);
	ElMessageBox({
		message: '是否要为卡密：' + row.cardCode + ' 续费 ' + row.cardValue + ' ' + cardType,
		title: '续费',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'success',
	})
		.then(function () {
			state.loading = true;
			quickRechargeCard({ id: row.id }).then((resp: any) => {
				if (resp.code === 0) {
					ElMessage.success('续费成功');
					handleQuery();
				}
				state.loading = false;
			});
		})
		.catch(() => {
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

const onOpenAddCard = () => {
	addCard.value.openDialog(softwareList.value, state.queryParams.softwareId);
};

const onEditCard = (row: any) => {
	editCard.value.openPulsDialog(row);
};

const onFreezeCard = (row: any) => {
	ElMessageBox({
		message: '冻结卡密后所有设备将会被下线！',
		title: '冻结卡密',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(function () {
			state.loading = true;
			freezeCard({ id: row.id }).then((resp: any) => {
				if (resp.code === 0) {
					ElMessage.success('冻结成功');
					handleQuery();
				}
				state.loading = false;
			});
		})
		.catch(() => {
		});
};

const onUnbindCard = (row: any) => {
	if (!row.activateTime) {
		ElMessage.warning('该卡尚未激活');
		return false;
	}
	ElMessageBox({
		message: '解绑卡密后所有绑定设备将会被下线！',
		title: '解绑卡密',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(function () {
			state.loading = true;
			unbindCard({ id: row.id }).then((resp: any) => {
				if (resp.code === 0) {
					ElMessage.success('解绑了' + resp.data.row + '个设备');
				}
				state.loading = false;
			});
		})
		.catch(() => {
		});
};

const onOpenImportCard = () => {
	importCard.value.openImportDialog();
};

onMounted(() => {
	getSoftwareList();
	handleQuery();
	proxy.mittBus.on('onEditCard', () => {
		handleQuery();
	});
});
onUnmounted(() => {
	proxy.mittBus.off('onEditCard');
});
</script>
