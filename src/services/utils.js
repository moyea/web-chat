const EXPIRE_TIME = 24 * 60 * 60 * 1000;

/**
 * 存储localStorage
 */
export const setStore = (key, data) => {
    if (!key) return;
    let o = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(key, JSON.stringify(o));
};

/**
 * 获取localStorage
 */
export const getStore = key => {
    if (!key) {
        return;
    }
    try {
        let item = localStorage.getItem(key);
        if (!item) {
            return;
        }
        let obj = JSON.parse(item);
        if (Date.now() - obj.timestamp > EXPIRE_TIME) {
            localStorage.removeItem(key);
            return;
        }
        return obj.data;
    } catch (e) {
        return null;
    }

};

/**
 * 删除localStorage
 */
export const removeStore = key => {
    if (!key) return;
    localStorage.removeItem(key);
};


