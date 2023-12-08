import instance from '@/utils/request';
import { IBaseResponse, IRecordTotal } from '@/types';

export interface IUserInfo {
  id: string;
  card: string;
  name: string;
  sex: 0 | 1;
  job: string;
  grade: string;
  remark: string;
}

/**
 * 获取人员信息
 * @returns
 */
export const getUserList = () => {
  return instance.request<any, IBaseResponse<IRecordTotal<IUserInfo>>>({
    url: '/tr/user',
    method: 'get'
  });
};

export const login = (name: String, password : String) => {
  return instance.request<any, IBaseResponse<Boolean>>({
    url:'login',
    method: 'post',
    data: {
      userName: name,
      password: password
    }

  })
}

export interface IContactInfo {
  id: number;
  userName: string;
  userName2: string;
  email: string;
  phone: string;
  reserveTime: string;
  content: string;
  commitTime: string
}

export const getContacts = (pageNum: number, pageSize: number) => {
  return instance.request<any, IBaseResponse<IRecordTotal<IContactInfo>>>({
    url:'/contact/list',
    method: 'post',
    data: {
      pageNum: pageNum,
      pageSize: pageSize
    }

  })
}

export interface IRealEstate {
  id: number;
  realEstateType: number;
  name: string;
  address: string;
  price: string;
  transportation: string;
  transportation1: string;
  transportation2: string;
  floorPlan: string;
  area: string;
  area2: string;
  floor: string;
  year: string;
  structure: string;
  use: string;
  rate: string;
  theWay: string;
  image: string;
}

export const getRealEstates = (realEstatetype: number, pageNum: number, pageSize: number) => {
  return instance.request<any, IBaseResponse<IRecordTotal<IRealEstate>>>({
    url:'/realEstate/list',
    method: 'post',
    data: {
      realEstatetype: realEstatetype,
      pageNum: pageNum,
      pageSize: pageSize
    }

  })
}

export const upload = (data: any) => {
  return instance.request<any, IBaseResponse<String>>({
    url:'/file/upload',
    method: 'post',
    data: data

  })
}

export const createRealEstate = (data: IRealEstate) => {
  return instance.request<any, IBaseResponse<Boolean>>({
    url:'/realEstate/save',
    method: 'post',
    data: data

  })
}

export const delRealEstates = (ids: Array<number>) => {
  return instance.request<any, IBaseResponse<Boolean>>({
    url:'/realEstate/del',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export interface IUserAdd {
  cardId: string;
  name: string;
  sex: 0 | 1;
  job: string;
  department: string;
}

export const getLoginCode = () => {
  return instance.request<any, Blob>({
    url: '/ued/code/loginCode',
    method: 'get',
    responseType: 'blob'
  });
};

export const download = async () => {
  const res = instance.request<any, Blob>({
    url: '/contact/download',
    method: 'get',
    responseType: 'blob'
  });
  const url = URL.createObjectURL(await res)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', "联络信息")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

};