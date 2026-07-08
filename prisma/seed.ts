import "dotenv/config";

import bcrypt from "bcrypt";

import { BookingStatus, UserRole } from "@prisma/client";

import { prisma } from "../src/config/prisma";
import { slugify } from "../src/utils/slugify";

const passwordRounds = 12;
const seedPassword = "Password@123";

const adminUser = {
  name: "System Admin",
  email: "admin@fixitnow.dev",
  password: seedPassword,
  role: UserRole.ADMIN,
  phone: "+8801000000000",
  avatarUrl: "https://example.com/admin-avatar.png",
};

const customerSeeds = [
  {
    name: "Aisha Rahman",
    email: "customer1@fixitnow.dev",
    phone: "+8801000000001",
  },
  {
    name: "Nabil Hasan",
    email: "customer2@fixitnow.dev",
    phone: "+8801000000002",
  },
  {
    name: "Tania Sultana",
    email: "customer3@fixitnow.dev",
    phone: "+8801000000003",
  },
];

const technicianSeeds = [
  {
    name: "Rahim Uddin",
    email: "technician1@fixitnow.dev",
    phone: "+8802000000001",
    location: "Dhaka",
    experienceYears: 8,
    hourlyRate: 1200,
    serviceRadius: 20,
    skills: ["plumbing", "pipe repair", "bathroom fittings"],
  },
  {
    name: "Marufa Akter",
    email: "technician2@fixitnow.dev",
    phone: "+8802000000002",
    location: "Chattogram",
    experienceYears: 6,
    hourlyRate: 1000,
    serviceRadius: 15,
    skills: ["electrical", "wiring", "fan repair"],
  },
  {
    name: "Sabbir Ahmed",
    email: "technician3@fixitnow.dev",
    phone: "+8802000000003",
    location: "Sylhet",
    experienceYears: 5,
    hourlyRate: 900,
    serviceRadius: 25,
    skills: ["cleaning", "deep cleaning", "appliance setup"],
  },
];

const categorySeeds = [
  {
    name: "Plumbing",
    description:
      "Pipe repair, tap fitting, drainage, and bathroom plumbing services.",
    iconUrl: "https://example.com/icons/plumbing.png",
  },
  {
    name: "Electrical",
    description:
      "Electrical wiring, fan repair, and fixture installation services.",
    iconUrl: "https://example.com/icons/electrical.png",
  },
  {
    name: "Cleaning",
    description: "Home and office cleaning services with flexible scheduling.",
    iconUrl: "https://example.com/icons/cleaning.png",
  },
  {
    name: "Appliance Repair",
    description: "Repair and maintenance for common household appliances.",
    iconUrl: "https://example.com/icons/appliance.png",
  },
];

const serviceSeeds = [
  {
    title: "Emergency Pipe Repair",
    description:
      "Fast plumbing diagnosis and same-day pipe repair for residential homes.",
    price: 1800,
    serviceLocation: "Dhaka",
    durationMinutes: 90,
    categoryName: "Plumbing",
    technicianEmail: "technician1@fixitnow.dev",
  },
  {
    title: "Bathroom Fitting Installation",
    description:
      "Professional installation of faucets, sinks, and bathroom accessories.",
    price: 2200,
    serviceLocation: "Dhaka",
    durationMinutes: 120,
    categoryName: "Plumbing",
    technicianEmail: "technician1@fixitnow.dev",
  },
  {
    title: "House Wiring Fix",
    description:
      "Electrical troubleshooting, wiring replacement, and switch repair.",
    price: 2500,
    serviceLocation: "Chattogram",
    durationMinutes: 150,
    categoryName: "Electrical",
    technicianEmail: "technician2@fixitnow.dev",
  },
  {
    title: "Deep Home Cleaning",
    description:
      "Detailed cleaning for living spaces, kitchens, and bathrooms.",
    price: 1600,
    serviceLocation: "Sylhet",
    durationMinutes: 180,
    categoryName: "Cleaning",
    technicianEmail: "technician3@fixitnow.dev",
  },
  {
    title: "Appliance Setup and Repair",
    description:
      "Setup and repair for common household appliances and small devices.",
    price: 1900,
    serviceLocation: "Sylhet",
    durationMinutes: 110,
    categoryName: "Appliance Repair",
    technicianEmail: "technician3@fixitnow.dev",
  },
];

const reviewSeeds = [
  {
    bookingNumber: "SEED-BK-1",
    customerEmail: "customer1@fixitnow.dev",
    technicianEmail: "technician1@fixitnow.dev",
    serviceTitle: "Emergency Pipe Repair",
    rating: 5,
    comment: "Quick response and excellent work quality.",
  },
  {
    bookingNumber: "SEED-BK-2",
    customerEmail: "customer2@fixitnow.dev",
    technicianEmail: "technician2@fixitnow.dev",
    serviceTitle: "House Wiring Fix",
    rating: 4,
    comment: "Professional service and clear communication.",
  },
  {
    bookingNumber: "SEED-BK-3",
    customerEmail: "customer3@fixitnow.dev",
    technicianEmail: "technician3@fixitnow.dev",
    serviceTitle: "Deep Home Cleaning",
    rating: 5,
    comment: "Very thorough cleaning and punctual team.",
  },
];

const main = async () => {
  const hashedPassword = await bcrypt.hash(seedPassword, passwordRounds);

  const admin = await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {
      name: adminUser.name,
      password: hashedPassword,
      phone: adminUser.phone,
      avatarUrl: adminUser.avatarUrl,
      role: UserRole.ADMIN,
    },
    create: {
      ...adminUser,
      password: hashedPassword,
    },
  });

  const customers = [];
  for (const customerSeed of customerSeeds) {
    const customer = await prisma.user.upsert({
      where: { email: customerSeed.email },
      update: {
        name: customerSeed.name,
        phone: customerSeed.phone,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
      create: {
        name: customerSeed.name,
        email: customerSeed.email,
        phone: customerSeed.phone,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
    });

    customers.push(customer);
  }

  const technicians = [];
  for (const technicianSeed of technicianSeeds) {
    const technician = await prisma.user.upsert({
      where: { email: technicianSeed.email },
      update: {
        name: technicianSeed.name,
        phone: technicianSeed.phone,
        password: hashedPassword,
        role: UserRole.TECHNICIAN,
      },
      create: {
        name: technicianSeed.name,
        email: technicianSeed.email,
        phone: technicianSeed.phone,
        password: hashedPassword,
        role: UserRole.TECHNICIAN,
      },
    });

    await prisma.technicianProfile.upsert({
      where: { userId: technician.id },
      update: {
        bio: `Experienced ${technicianSeed.skills[0]} specialist based in ${technicianSeed.location}.`,
        experienceYears: technicianSeed.experienceYears,
        location: technicianSeed.location,
        hourlyRate: technicianSeed.hourlyRate,
        serviceRadius: technicianSeed.serviceRadius,
        skills: technicianSeed.skills,
      },
      create: {
        userId: technician.id,
        bio: `Experienced ${technicianSeed.skills[0]} specialist based in ${technicianSeed.location}.`,
        experienceYears: technicianSeed.experienceYears,
        location: technicianSeed.location,
        hourlyRate: technicianSeed.hourlyRate,
        serviceRadius: technicianSeed.serviceRadius,
        skills: technicianSeed.skills,
      },
    });

    technicians.push(technician);
  }

  const categories = [];
  for (const categorySeed of categorySeeds) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(categorySeed.name) },
      update: {
        name: categorySeed.name,
        description: categorySeed.description,
        iconUrl: categorySeed.iconUrl,
        isActive: true,
      },
      create: {
        name: categorySeed.name,
        slug: slugify(categorySeed.name),
        description: categorySeed.description,
        iconUrl: categorySeed.iconUrl,
        isActive: true,
      },
    });

    categories.push(category);
  }

  const services = [];
  for (const serviceSeed of serviceSeeds) {
    const category = categories.find(
      (item) => item.name === serviceSeed.categoryName,
    );
    const technician = technicians.find(
      (item) => item.email === serviceSeed.technicianEmail,
    );

    if (!category || !technician) {
      continue;
    }

    const service = await prisma.service.upsert({
      where: { slug: slugify(serviceSeed.title) },
      update: {
        title: serviceSeed.title,
        description: serviceSeed.description,
        price: serviceSeed.price,
        serviceLocation: serviceSeed.serviceLocation,
        durationMinutes: serviceSeed.durationMinutes,
        categoryId: category.id,
        technicianId: technician.id,
        isActive: true,
      },
      create: {
        title: serviceSeed.title,
        slug: slugify(serviceSeed.title),
        description: serviceSeed.description,
        price: serviceSeed.price,
        serviceLocation: serviceSeed.serviceLocation,
        durationMinutes: serviceSeed.durationMinutes,
        categoryId: category.id,
        technicianId: technician.id,
        isActive: true,
      },
    });

    services.push(service);
  }

  for (const reviewSeed of reviewSeeds) {
    const customer = customers.find(
      (item) => item.email === reviewSeed.customerEmail,
    );
    const technician = technicians.find(
      (item) => item.email === reviewSeed.technicianEmail,
    );
    const service = services.find(
      (item) => item.title === reviewSeed.serviceTitle,
    );

    if (!customer || !technician || !service) {
      continue;
    }

    const category = categories.find((item) => item.id === service.categoryId);

    const booking = await prisma.booking.upsert({
      where: { bookingNumber: reviewSeed.bookingNumber },
      update: {
        customerId: customer.id,
        technicianId: technician.id,
        serviceId: service.id,
        categoryId: category?.id ?? service.categoryId,
        scheduledAt: new Date(),
        address: "Seed Address",
        location: service.serviceLocation,
        price: service.price,
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
      create: {
        bookingNumber: reviewSeed.bookingNumber,
        customerId: customer.id,
        technicianId: technician.id,
        serviceId: service.id,
        categoryId: category?.id ?? service.categoryId,
        scheduledAt: new Date(),
        address: "Seed Address",
        location: service.serviceLocation,
        price: service.price,
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await prisma.review.upsert({
      where: { bookingId: booking.id },
      update: {
        rating: reviewSeed.rating,
        comment: reviewSeed.comment,
      },
      create: {
        bookingId: booking.id,
        customerId: customer.id,
        technicianId: technician.id,
        serviceId: service.id,
        rating: reviewSeed.rating,
        comment: reviewSeed.comment,
      },
    });
  }

  for (const service of services) {
    const stats = await prisma.review.aggregate({
      where: { serviceId: service.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.service.update({
      where: { id: service.id },
      data: {
        averageRating: stats._avg.rating ?? 0,
        reviewCount: stats._count.rating,
      },
    });
  }

  console.log(`Seed completed. Admin: ${admin.email}`);
  console.log(`Customers created: ${customers.length}`);
  console.log(`Technicians created: ${technicians.length}`);
  console.log(`Categories created: ${categories.length}`);
  console.log(`Services created: ${services.length}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
