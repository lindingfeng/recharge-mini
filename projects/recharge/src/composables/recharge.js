import { reactive, computed } from 'vue'
import apis from '@global/apis/recharge'

function getLatestOrder (params = {}) {
  return apis.getLatestOrder(params)
}

function getPhoneExample (params = {}) {
  return apis.getExamples(params)
}

function checkAccount (params = {}) {
  return apis.checkAccount(params)
}

function getProducts (params = {}) {
  return apis.getProducts(params)
}

function queryBalance (params = {}) {
  return apis.getBalance(params)
}

function getOperators (params = {}) {
  return apis.getOperators(params)
}

export function phoneRecharge () {
  const data = reactive({
    phone: '',
    operatorId: '',
    rechargeIdx: '',
    rechargeValue: '',
    verifyInfo: {},
    exampleInfo: {},
    balanceInfo: {},
    rechargeInfo: {},
    operatorList: [],
    loading: false,
    operatorActionSheet: false,
    operatorLoading: false,
    productLoading: false,
    rechargePopup: false
  })

  const allowRecharge = computed(() => {
    return data.phone && data.verifyInfo.is_valid && !data.productLoading && ((data.rechargeIdx !== '' && !data.rechargeValue) || allowRange.value)
  })

  const allowRange = computed(() => {
    return data.rechargeValue && Number(data.rechargeValue) >= rangeList.value[0].product_amount_min && Number(data.rechargeValue) <= rangeList.value[0].product_amount_max && Number(data.rechargeValue) % 5 === 0
  })
  
  const amountList = computed(() => {
    return data.rechargeInfo.fixed_amounts || []
  })
  
  const rangeList = computed(() => {
    return data.rechargeInfo.range_amounts || []
  })

  const showRechargeList = computed(() => {
    return amountList.value.length || (amountList.value.length === 0 && rangeList.value.length === 0)
  })

  const removeFailureInfo = (info = {}) => {
    data.verifyInfo = info
    data.rechargeIdx = ''
    data.rechargeValue = ''
  }

  return {
    data,
    allowRecharge,
    amountList,
    rangeList,
    showRechargeList,
    getLatestOrder,
    getPhoneExample,
    checkAccount,
    getOperators,
    getProducts,
    queryBalance,
    removeFailureInfo
  }
}

export function networkRecharge () {
  const data = reactive({
    account: '',
    operatorId: '',
    rechargeIdx: '',
    rechargeValue: '',
    operatorList: [],
    balanceInfo: {},
    rechargeInfo: {},
    loading: false,
    operatorLoading: false,
    productLoading: false,
    rechargePopup: false
  })

  const allowRecharge = computed(() => {
    return data.account && data.operatorId && !data.productLoading && ((data.rechargeIdx !== '' && !data.rechargeValue) || allowRange.value)
  })

  const allowRange = computed(() => {
    return data.rechargeValue && Number(data.rechargeValue) >= rangeList.value[0].product_amount_min && Number(data.rechargeValue) <= rangeList.value[0].product_amount_max && Number(data.rechargeValue) % 5 === 0
  })
  
  const amountList = computed(() => {
    return data.rechargeInfo.fixed_amounts || []
  })
  
  const rangeList = computed(() => {
    return data.rechargeInfo.range_amounts || []
  })

  return {
    data,
    allowRecharge,
    amountList,
    rangeList,
    getLatestOrder,
    getOperators,
    getProducts,
    queryBalance
  }
}

export function salikRecharge () {
  const data = reactive({
    account: '',
    pin: '',
    operatorId: '',
    rechargeIdx: '',
    rechargeValue: '',
    rechargeInfo: {},
    operatorList: [],
    loading: false,
    operatorLoading: false,
    productLoading: false
  })

  const allowRecharge = computed(() => {
    return data.account && data.pin && !data.productLoading && ((data.rechargeIdx !== '' && !data.rechargeValue) || allowRange.value)
  })

  const allowRange = computed(() => {
    return data.rechargeValue && Number(data.rechargeValue) >= rangeList.value[0].product_amount_min && Number(data.rechargeValue) <= rangeList.value[0].product_amount_max && Number(data.rechargeValue) % 5 === 0
  })
  
  const amountList = computed(() => {
    return data.rechargeInfo.fixed_amounts || []
  })
  
  const rangeList = computed(() => {
    return data.rechargeInfo.range_amounts || []
  })

  return {
    data,
    allowRecharge,
    amountList,
    rangeList,
    getLatestOrder,
    getOperators,
    getProducts
  }
}