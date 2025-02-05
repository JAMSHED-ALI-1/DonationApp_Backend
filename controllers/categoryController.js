const asyncHandler = require('express-async-handler')
const Category = require('../models/categoryModel.js')


// @desc    Add News
// @route   POST /api/news/addNews
// @access  Private
const addCategory = asyncHandler(async (req, res) => {
    const { category_name } = req.body
    const category = await Category.findOne({ category_name: category_name });

    if (category) {
        return res.status(401).json({
            success: false,
            msg: 'Category already added.'
        })
    }

    const new_cat = await Category.create({ category_name });

    res.status(201).json({
        success: true,
        msg: 'Category created',
        data: new_cat
    })


})


const deleteCategory = asyncHandler(async (req, res) => {
    console.log(req.params.catId)
    const category = await Category.findByIdAndDelete(req.params.catId);

    console.log(category)

    res.status(201).json({
        success: true,
        msg: 'Successfully Deleted',
        data: category
    })

    if (!category) {
        return res.status(401).json({
            success: false,
            msg: 'Category not found.'
        })
    }

})



const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({})
    res.json({
        success: true,
        data: categories
    })
})


const editCategory = asyncHandler(async (req, res) => {
    let category = await Category.findById(req.params.catId);

    if (!category) {
        return res.status(401).json({
            success: false,
            msg: 'Category not found.'
        })
    }

    category = await Category.findByIdAndUpdate(req.params.catId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: category, msg: 'Successfully updated' });
})

module.exports = {
    addCategory,
    deleteCategory,
    getAllCategories,
    editCategory,
}