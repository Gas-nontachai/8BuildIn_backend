const Task = function (task) { this.task = task.task }

const { MaterialModel } = require('@/models')
const { fileUpload, removeFile } = require("@/utils/file-helper");

const directory = 'material_imgs'

Task.generateMaterialID = (connection) => MaterialModel.generateMaterialID(connection)
Task.getMaterialBy = (connection, data) => MaterialModel.getMaterialBy(connection, data)
Task.getMaterialByID = (connection, data) => MaterialModel.getMaterialByID(connection, data)

Task.insertMaterial = async (connection, data, files) => {
    if (data.material) {
        const material = JSON.parse(data.material);

        material.material_id = await MaterialModel.generateMaterialID(connection)

        if (files) {
            for (const key in files) {
                const material_img = await fileUpload(files[key], directory)
                material.material_img = material_img
                await MaterialModel.insertMaterial(connection, material);
                return await MaterialModel.getMaterialByID(connection, { material_id: material.material_id });
            };
        } else {
            await MaterialModel.insertMaterial(connection, material);
            return await MaterialModel.getMaterialByID(connection, { material_id: material.material_id });
        }
    } else {
        data.material_id = await MaterialModel.generateMaterialID(connection)
        await MaterialModel.insertMaterial(connection, data);
    }
};

Task.updateMaterialBy = async (connection, data, files) => {
    if (data.material) {
        const material = JSON.parse(data.material);
        const old_material = await MaterialModel.getMaterialByID(connection, { material_id: material.material_id })
        await removeFile(old_material.material_img)

        if (files) {
            for (const key in files) {
                const material_img = await fileUpload(files[key], directory)
                material.material_img = material_img
                await MaterialModel.updateMaterialBy(connection, material);
                return await MaterialModel.getMaterialByID(connection, { material_id: material.material_id });
            };
        } else {
            await MaterialModel.updateMaterialBy(connection, material);
            return await MaterialModel.getMaterialByID(connection, { material_id: material.material_id });
        }
    } else {
        await MaterialModel.updateMaterialBy(connection, data);
    }

}

Task.deleteMaterialBy = async (connection, data) => {
    await MaterialModel.deleteMaterialBy(connection, data)
}

module.exports = Task