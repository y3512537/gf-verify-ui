<template>
	<div class="app-container">
		<el-card shadow="always">
			<!-- 查询 -->
			<el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
				<el-form-item label="卡密" prop="cardCode">
					<el-input v-model="queryParams.cardCode" placeholder="请输入卡密" clearable size="default" @keyup.enter.native="handleQuery" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="mini" @click="handleQuery">
						<SvgIcon name="elementSearch" />
						搜索</el-button
					>
					<el-button size="mini" @click="resetQuery">
						<SvgIcon name="elementRefresh" />
						重置
					</el-button>
				</el-form-item>
			</el-form>
			<!--数据表格-->
			<el-table v-loading="loading" :data="tableData">
				<el-table-column label="卡密" align="center"  prop="cardCode"/>
				<el-table-column label="设备编号" align="center" prop="deviceId" />
				<el-table-column label="超时时间" align="center" prop="sessionTimeout" />
				<el-table-column label="创建时间" align="center" prop="createdAt" />
			</el-table>
			<!-- 分页设置-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="mt15" :pager-count="5" :page-sizes="[10, 20, 30, 50]" v-model:current-page="queryParams.pageIndex" background v-model:page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
		</el-card>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted } from 'vue';
import { listCardSession }  from '/@/api/verify/cardSession';
export default {
	name: 'cardSessionList',
	setup() {
		const state = reactive({
			// 遮罩层
			loading: true,
			// 选中数组
			ids: [],
			// 非单个禁用
			single: true,
			// 非多个禁用
			multiple: true,
			// 弹出层标题
			title: '',
			// 岗位表格数据
			tableData: [],
			// 总条数
			total: 0,
			// statusOptions字典数据
			statusOptions: [],
			// 查询参数
			queryParams: {
				// 页码
				pageNum: 1,
				// 每页大小
				pageSize: 10,
				// 以下为参数
				cardCode: undefined,
			},
		});

		/** 查询Session列表 */
		const handleQuery = () => {
			state.loading = true;
			listCardSession(state.queryParams).then((response) => {
				state.tableData = response.data.list;
				state.total = response.data.total;
				state.loading = false;
			});
		};
		/** 重置按钮操作 */
		const resetQuery = () => {
			//state.queryParams.name = undefined;
			handleQuery();
		};

		const handleCurrentChange = (val: number) => {
			state.queryParams.pageNum = val;
			handleQuery();
		};
		const handleSizeChange = (val: number) => {
			state.queryParams.pageSize = val;
			handleQuery();
		};
    onMounted(() => {
      handleQuery();
    })
		return {
			handleQuery,
			handleCurrentChange,
			handleSizeChange,
			resetQuery,
			...toRefs(state),
		};
	},
};
</script>
