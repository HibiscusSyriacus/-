import Http from "../utils/http";
class Category{
    static  async _getCategoryList(){
        return Http.request({
            url:'v1/category',
        })
    }
    static async getCategoryListWithAll(){
        const categoryList=await Category._getCategoryList()
        categoryList.unshift({id:0,name:'全部'})
        return categoryList
    }
}
export default Category