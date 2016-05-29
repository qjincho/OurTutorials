/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import md5 from 'spark-md5';
import * as types from 'types';

polyfill();

export function typing(text) {
  return {
    type: types.TYPING,
    newCategory: text
  }
}

export function makeCategoryRequest(method, data, api = '/category') {
  return request[method](api, data);
}

export function makeLinkRequest(method, data, api='/category/link') {
  return request[method](api, data);
}

export function fetchCategories() {
  return {
    type: types.GET_CATEGORIES,
    promise: makeCategoryRequest('get')
  };
}

export function getChildren(id) {
  return {
    type: types.GET_CHILDREN,
    id: id,
    promise: makeCategoryRequest('get', {
      classId : id
    })
  };
}

export function getAllLinks(id) {
  return {
    type: types.GET_ALL_LINKS,
    promise: makeLinkRequest('get', {
      classId: id
    })
  };
}

export function addCategorySuccess() {
  return {
    type: types.ADD_CATEGORY_SUCCESS
  };
}

export function addCategoryFailure() {
  return {
    type: types.ADD_CATEGORY_FAILURE
  };
}

export function addCategoryDuplicate() {
  return {
    type: types.ADD_CATEGORY_DUPLICATE
  }
}

export function addCategory(parentId, name) {
  // type: types.ADD_CATEGORY,
  // promise: makeCategoryRequest('post',{
  //   parentId: parentId,
  //   newCategoryName: name
  // })
  const name = name.trim();

  return (dispatch, getState) => {
    if(name.length <= 0) return;

    const { category } = getState();
    if (category.categories.filter(categoryItem => categoryItem.name === name).length > 0) {
      return dispatch(addCategoryDuplicate());
    }else {
      return makeCategoryRequest('post',{
        parentId: parentId,
        newCategoryName: name
      })
      .then(res => {
        if(res.status === 200) {
          return dispatch(addCategorySuccess());
        }
      })
      .catch(() => {
        return dispatch(addCategoryFailure());
      })
    }
  }
}
