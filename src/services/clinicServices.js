import db from "../models/index";

let createClinic = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
				resolve({
					errCode: 1,
					errMessage: "Missing parameter...",
				});
			} else {
				await db.Clinics.create({
					name: data.name,
					image: data.imageBase64,
					address: data.address,
					descriptionHTML: data.descriptionHTML,
					descriptionMarkdown: data.descriptionMarkdown,
				});

				resolve({
					errCode: 0,
					errMessage: "Success.",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

let getAllClinic = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await db.Clinics.findAll();
			if (data && data.length > 0) {
				data.map((item) => {
					item.image = Buffer.from(item.image, "base64").toString("binary");
					return item;
				});
			}
			resolve({
				errCode: 0,
				errMessage: "Succes",
				data,
			});
		} catch (e) {
			reject(e);
		}
	});
};

let getDetailClinicById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				resolve({
					errCode: 1,
					errMessage: "Missing parameter ...",
				});
			} else {
				let data = await db.Clinics.findOne({
					where: { id },
					attributes: ["address", "name", "descriptionHTML", "descriptionMarkdown"],
				});
				if (data) {
					let doctorClinic = [];
					doctorClinic = await db.Doctor_Infor.findAll({
						where: { clinicId: id },
						attributes: ["doctorId", "provinceId"],
					});
					data.doctorClinic = doctorClinic;
				} else data = {};
				resolve({
					errCode: 0,
					errMessage: "Success",
					data,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createClinic,
	getAllClinic,
	getDetailClinicById,
};
