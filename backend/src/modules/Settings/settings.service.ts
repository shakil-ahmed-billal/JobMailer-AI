import { prisma } from "../../lib/prisma";

export const SettingsService = {
  getSettings: async (userId: string) => {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
        },
      });
    }

    return settings;
  },

  updateSettings: async (userId: string, data: any) => {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          ...data,
        },
      });
    } else {
      settings = await prisma.userSettings.update({
        where: { userId },
        data,
      });
    }

    return settings;
  },
};
