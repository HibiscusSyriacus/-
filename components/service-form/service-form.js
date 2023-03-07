import serviceType from "../../enum/service-type";
import { getDataSet, getEventParam } from "../../utils/utils";
import Category from "../../model/category";
const moment = require("../../lib/moment")

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        form:Object
    },
//   observers: {
//         form: function (newValue) {
//             if (!newValue) {
//                 return
//             }
//             this._init()
//         }
//     },
    /**
     * 组件的初始数据
     */
    data: {
        typeList: [
            {
                id: serviceType.PROVIDE,
                name: '提供服务'
            },
            {
                id: serviceType.SEEK,
                name: '找服务'
            }
        ],
        typePickerIndex: null,
        categoryList: [],
        categoryPickerIndex: null,
        formData: {
            type: null,
            title: '',
            category_id: null,
            cover_image_id: null,
            description: '',
            designated_place: false,
            begin_date: '',
            end_date: '',
            price: ''
        },
        rules: [
            {
                name: 'type',
                rules: { required: true, message: '请指定服务类型' },
            },
            {
                name: 'title',
                rules: [
                    { required: true, message: '服务标题内容不能为空' },
                    { minlength: 5, message: '服务描述内容不能少于 5 个字' },
                ],
            },
            {
                name: 'category_id',
                rules: { required: true, message: '未指定服务所属分类' },
            },
            {
                name: 'cover_image_id',
                rules: { required: true, message: '请上传封面图' },
            },
            {
                name: 'description',
                rules: [
                    { required: true, message: '服务描述不能为空' },
                    { minlength: 20, message: '服务描述内容不能少于 20 个字' },
                ],
            },
            {
                name: 'begin_date',
                rules: [
                    { required: true, message: '请指定服务有效日期开始时间' },
                ],
            },
            {
                name: 'end_date',
                rules: [
                    { required: true, message: '请指定服务有效日期结束时间' },
                    {
                        validator: function (rule, value, param, models) {
                            if (moment(value).isSame(models.begin_date) || moment(value).isAfter(models.begin_date)) {
                                return null
                            }
                            return '结束时间必须大于开始时间'
                        }
                    }
                ],

            },
            {
                name: 'price',
                rules: [
                    { required: true, message: '请指定服务价格' },
                    {
                        validator: function (rule, value) {
                            // 正则表达式
                            const pattern = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/
                            const isNum = pattern.test(value);

                            if (isNum) {
                                return null
                            }
                            return '价格必须是数字'
                        }
                    },
                    { min: 1, message: '天下没有免费的午餐' },
                ],
            },
        ],
        error: null,
        resetForm: true,
        serviceTypeEnum: serviceType

    },
    pageLifetimes: {
        show() {
            
            if (this.data.resetForm) {
                this._init(this.data.form)
            }
            this.data.resetForm = true
        },
        hide() {
            
            if (this.data.resetForm) {
                this.setData({
                    showForm: false
                })
            }
        }
    },

    // lifetimes: {
    //     attached() {
    //         _init()
    //     }
    // },

    /**
     * 组件的方法列表
     */
    methods: {
   async _init(){
    
        const typePickerIndex = this.data.typeList.findIndex(item => this.data.form.type === item.id)
        const categoryList = await Category.getCategoryList()
        const categoryPickerIndex = categoryList.findIndex(item => this.data.form.category_id === item.id)

        this.setData({
            showForm:true,
            typePickerIndex:typePickerIndex!==-1 ? typePickerIndex:null,
            categoryPickerIndex: categoryPickerIndex !== -1 ? categoryPickerIndex : null,
            categoryList,
            files: this.data.form.cover_image ? [this.data.form.cover_image] : [],

            //深拷贝浅拷贝
            formData: {
                showForm:true,
                type: this.data.form.type,
                title: this.data.form.title,
                category_id: this.data.form.category_id,
                cover_image_id: this.data.form.cover_image ? this.data.form.cover_image.id : null,
                description: this.data.form.description,
                designated_place: this.data.form.designated_place,
                begin_date: this.data.form.begin_date,
                end_date: this.data.form.end_date,
                price: this.data.form.price
            },
        })

    },

    submit() {
        console.log(this.data.formData)
        this.selectComponent('#form').validate((valid, errors) => {
            if (!valid) {
                const errMsg = errors.map(error => error.message)
                this.setData({
                    error: errMsg.join(';')
                })
                return
            }
            this.triggerEvent('submit', { formData: this.data.formData })
        })
    },

    handleTypeChange: function (event) {
        console.log(event)
        const index = getEventParam(event, 'value')
        this.setData({
            typePickerIndex: index,
            ['formData.type']: this.data.typeList[index].id,
        })

    },

    handleInput: function (event) {
        const value = getEventParam(event, 'value')
        const field = getDataSet(event, 'field')

        this.setData({
            [`formData.${field}`]: value
        })
    },

    handleCategoryChange: function (event) {
        const index = getEventParam(event, 'value')
        this.setData({
            categoryPickerIndex: index,
            ['formData.category_id']: this.data.categoryList[index].id
        })
    },

    handleSwitchChange: function (event) {
        const res = getEventParam(event, 'value')

        this.setData({
            ['formData.designated_place']: res
        })
    },

    handleBeginDateChange: function (event) {
        const beginDate = getEventParam(event, 'value')
        this.setData({
            ['formData.begin_date']: beginDate
        })
    },

    handleEndDateChange: function (event) {
        const endDate = getEventParam(event, 'value')
        this.setData({
            ['formData.end_date']: endDate
        })
    },

    handleUploadSuccess: function (event) {
        console.log(event)
        const id = event.detail.files[0].id
        this.setData({
            ['formData.cover_image_id']: id
        })
    },

    handleHidePage: function () {
        this.data.resetForm = false
    }

    },

})
