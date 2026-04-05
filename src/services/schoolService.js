const schoolRepository = require('../repositories/schoolRepository');

class SchoolService {
  async getAllSchools(kitchenId = null) {
    return await schoolRepository.getAll(kitchenId);
  }

  async getSchoolById(id) {
    const school = await schoolRepository.findById(id);
    if (!school) {
      throw new Error('School not found');
    }
    return school;
  }

  async createSchool(schoolData) {
    const { school_name, target_group } = schoolData;
    if (!school_name || !target_group) {
      throw new Error('School name and target group are required');
    }
    return await schoolRepository.create(schoolData);
  }

  async updateSchool(id, schoolData, kitchenId = null) {
    const school = await this.getSchoolById(id);
    
    // If kitchenId is provided (Nutritionist), verify ownership
    if (kitchenId && school.kitchen_id !== kitchenId) {
      throw new Error('Unauthorized - You do not have permission to update this school');
    }

    return await schoolRepository.update(id, schoolData);
  }

  async deleteSchool(id) {
    await this.getSchoolById(id); // Ensure exists
    return await schoolRepository.delete(id);
  }
}

module.exports = new SchoolService();
