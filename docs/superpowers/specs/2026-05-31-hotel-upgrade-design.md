# 酒店管理系统 — 功能增强与 UI/UX 全量升级设计

> 日期：2026-05-31
> 方案：渐进升级（在现有代码基础上迭代）
> 范围：客户前台 + 管理后台

---

## 一、新功能

### 1.1 评价系统

**实体：Review**

| 字段 | 类型 | 约束 |
|------|------|------|
| id | Long | PK, auto |
| rating | Integer | NOT NULL, 1-5 |
| content | String | NOT NULL, max 500 |
| user | User | ManyToOne, NOT NULL |
| room | Room | ManyToOne, NOT NULL |
| createdAt | LocalDateTime | auto |
| visible | Boolean | default true（管理员可隐藏） |

**API**

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | `/api/rooms/{id}/reviews` | CUSTOMER | 提交评价（限已完成的订单） |
| GET | `/api/rooms/{id}/reviews` | 公开 | 获取某房间评价列表 |
| GET | `/api/reviews` | ADMIN | 管理员查看所有评价 |
| PATCH | `/api/reviews/{id}/hide` | ADMIN | 隐藏不当评价 |

**前端**
- 房间详情页底部：评价列表 + 平均评分徽章
- 管理后台新增评价管理页 `/admin/reviews`
- 评价提交：5星点击选择 + 文字输入框 + 提交按钮
- 已评价订单显示"已评价"标签，不可重复提交

### 1.2 房间收藏

**实体：Favorite**

| 字段 | 类型 | 约束 |
|------|------|------|
| id | Long | PK, auto |
| user | User | ManyToOne, NOT NULL |
| room | Room | ManyToOne, NOT NULL |
| createdAt | LocalDateTime | auto |

**唯一约束：** (user_id, room_id)

**API**

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | `/api/favorites/{roomId}` | CUSTOMER | 收藏房间 |
| DELETE | `/api/favorites/{roomId}` | CUSTOMER | 取消收藏 |
| GET | `/api/favorites` | CUSTOMER | 我的收藏列表 |

**前端**
- 房间卡片右上角 ♥ 图标：未收藏空心灰色，已收藏实心红色
- 房间详情页大图区域右上角同样的 ♥ 图标
- 新页面 `/my-favorites`：收藏的房间列表，布局同房间浏览页

### 1.3 排序筛选增强

**房间列表页（客户）**
- 新增：价格升序/降序切换按钮
- 新增：楼层筛选（下拉选择 3F/4F/5F）
- 保留：房型筛选标签（已有）
- API 支持：`GET /api/rooms/available?sortBy=price&sortDir=asc&floor=3`

**房间列表页（管理后台）**
- 新增：状态筛选（全部/可用/已住/维修/已预订）
- 新增：楼层筛选
- 新增：搜索框（按房号搜索）

### 1.4 订单详情页

**新页面：`/my-reservations/:id`**

展示内容：
- 房间信息卡片（图片+名称+房型+楼层）
- 预订状态时间线（提交 → 确认 → 入住 → 退房，已完成步骤高亮）
- 预订详情：入住日期、退房日期、入住人数、特殊要求
- 价格明细：每晚价格 × 晚数 = 总价
- 操作区：未确认时可取消、已完成后可评价

**管理后台：`/admin/reservations/:id`** 同样升级详情展示

---

## 二、UI 升级规格

### 2.1 设计原则

- **克制**：减少装饰，增加留白，让内容呼吸
- **层次**：通过字号/字重/颜色区分信息层级
- **一致**：所有页面统一间距、圆角、阴影、交互模式

### 2.2 配色（保持现有配色基调）

| 角色 | 用途 | Hex |
|------|------|-----|
| primary | 按钮、导航文字 | #111827 |
| secondary | 副文字 | #6B7280 |
| accent | 价格、CTA高亮 | #D97706 |
| accent-light | 浅背景 | #FEF3C7 |
| success | 可用状态 | #059669 |
| warning | 待确认 | #D97706 |
| error | 错误/取消 | #DC2626 |
| bg | 页面背景 | #F9FAFB |
| surface | 卡片背景 | #FFFFFF |
| border | 边框 | #E5E7EB |

### 2.3 组件升级

| 组件 | 现在 | 升级后 |
|------|------|--------|
| 导航栏 | 64px + shadow-sm | 64px + 细底边框 border-b，hover 下划线动画 |
| 卡片 | rounded-lg shadow-sm | rounded-2xl(16px) p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all |
| 按钮(主) | h-9 rounded-md | h-11 rounded-xl transition-all active:scale-[0.98] |
| 输入框 | h-10 rounded-md | h-11 rounded-xl focus:ring-2 focus:ring-amber-500 |
| 页面标题 | text-2xl font-bold | text-3xl font-bold tracking-tight + text-gray-500 副标题 |
| 空状态 | 纯文字 | 居中图标 + 文字 + 行动按钮 |
| 加载态 | "加载中..." | 骨架屏 shimmer 动画（3行灰色条脉动） |
| 图片区域 | 灰色渐变 | SVG插画 + rounded-t-2xl 裁切 + hover:scale-105 transition |
| 房间卡片 | 固定布局 | hover 时轻微上浮+阴影加深 |

### 2.4 交互升级

| 场景 | 现在 | 升级后 |
|------|------|--------|
| 表单提交 | submit后toast | 实时校验 + 字段下方红色提示 + 提交按钮 loading spinner |
| 删除/取消 | confirm() | 使用 Dialog 确认组件替代 |
| Toast | sonner 默认 | 保持 sonner，位置右下角 |
| 页面切换 | 无动画 | 添加 fade-in 过渡 |
| 收藏操作 | 无 | 点击 ♥ 时 +1/-1 动画 + toast |
| 评价提交 | 无 | 星星点击 + 表单校验 + toast |

### 2.5 面包屑导航

所有页面顶部加面包屑：
- 首页 > 浏览客房 > 房间详情
- 首页 > 我的预订 > 订单详情
- 管理后台 > 房间管理
- 等

### 2.6 骨架屏组件

创建 `<Skeleton />` 组件，替代所有 "加载中..." 文字：
- 圆角矩形，bg-gray-200，animate-pulse
- 按实际内容形状：卡片骨架、列表骨架、详情骨架

---

## 三、管理后台升级

### 3.1 Dashboard 统计卡
- 每张卡片加图标 + 趋势箭头（今日vs昨日对比）
- 不同指标用不同颜色：可用(绿)/已住(蓝)/维修(黄)/待确认(橙)

### 3.2 表格增强
- 行 hover 高亮 bg-gray-50
- 操作按钮组（查看/编辑/删除）右侧固定
- 状态标签用彩色 Badge

### 3.3 新增评价管理页 `/admin/reviews`
- 表格列：房间号、客户名、评分（星星）、内容、时间、状态（显示/隐藏）
- 操作：隐藏/显示 切换

### 3.4 入住退房页优化
- 待确认预订卡片增加快捷确认按钮
- 入住中卡片增加快捷退房按钮
- 增加搜索框（按客户名/房间号）

---

## 四、新增页面/路由清单

### 客户前台

| 路由 | 页面 | 说明 |
|------|------|------|
| `/my-favorites` | MyFavoritesPage | 收藏列表 |
| `/my-reservations/:id` | ReservationDetailPage | 订单详情 |
| `/rooms/detail/:id` (升级) | RoomDetailPage | 增加评价+收藏 |

### 管理后台

| 路由 | 页面 | 说明 |
|------|------|------|
| `/admin/reviews` | ReviewsPage | 评价管理 |
| `/admin/reviews` (升级) | 添加隐藏/显示操作 | |

### 共享组件

| 组件 | 说明 |
|------|------|
| `<Skeleton />` | 骨架屏动画组件 |
| `<Breadcrumb />` | 面包屑导航组件 |
| `<ConfirmDialog />` | 确认对话框（替代 confirm()） |
| `<StarRating />` | 5星评分输入组件 |
| `<FavoriteButton />` | 收藏按钮组件（♥ 图标+动画） |

---

## 五、后端新增 API 清单

| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/rooms/{id}/reviews` | 提交评价 |
| GET | `/api/rooms/{id}/reviews` | 获取房间评价 |
| GET | `/api/reviews` | 管理员查看所有评价 |
| PATCH | `/api/reviews/{id}/hide` | 隐藏/显示评价 |
| POST | `/api/favorites/{roomId}` | 收藏房间 |
| DELETE | `/api/favorites/{roomId}` | 取消收藏 |
| GET | `/api/favorites` | 我的收藏列表 |
| GET | `/api/rooms/available` | 增加参数: sortBy, sortDir, floor |
| GET | `/api/reservations/{id}` | 获取预订详情（已有，确认返回完整信息） |

---

## 六、不做什么（排除范围）

- 支付系统
- 图片上传（房间图片保持 SVG 插画）
- 邮件/短信通知
- 国际化/多语言
- STAFF 角色权限细分
- 数据导出/报表
- 审计日志