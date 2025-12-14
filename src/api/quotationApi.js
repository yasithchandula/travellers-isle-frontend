const KEY = "TI_quotations";

export const quotationApi = {
  async getAll() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  },
  async saveAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  },
  async saveOne(q) {
    const list = await this.getAll();
    const i = list.findIndex(x => x.id === q.id);
    if (i >= 0) list[i] = q; else list.push(q);
    await this.saveAll(list);
    return q;
  },
  async getById(id) {
    const list = await this.getAll();
    return list.find(x => x.id === id) || null;
  },
};
