import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'dotinspire787@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      name: 'Dot Inspire Admin',
      email: adminEmail,
      passwordHash,
      role: 'SUPERADMIN',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Default Website Settings
  const settings = await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {
      instagramUrl: 'https://www.instagram.com/dot_inspire_/',
    },
    create: {
      id: 'default',
      businessName: 'Dot Inspire Design Studio',
      legalName: 'Dot Inspire Interior Design Studio LLP',
      phone: '7591953607',
      whatsapp: '7591953607',
      email: 'dotinspire787@gmail.com',
      address: 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India',
      instagramUrl: 'https://www.instagram.com/dot_inspire_/',
      footerText: 'Crafting timeless interior and architectural environments with passion and gold-standard precision.',
    },
  });
  console.log(`✅ Website settings seeded for ${settings.businessName}`);

  // 3. Seed Core Required Services
  const initialServices = [
    {
      name: 'Interior Design',
      shortDescription: 'Comprehensive luxury interior space planning and execution for residential and commercial spaces.',
      description: 'Our interior design services bring harmony, ergonomics, and aesthetic sophistication to every room. From conceptual 3D renders to fine material selection and execution.',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 1,
      isFeatured: true,
    },
    {
      name: 'Exterior Design',
      shortDescription: 'Modern architectural elevation and exterior facade designs crafted for lasting impact.',
      description: 'Transforming exterior architecture with weather-resistant materials, contemporary lighting, custom claddings, and striking geometric lines.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 2,
      isFeatured: true,
    },
    {
      name: 'Blinds & Curtains',
      shortDescription: 'Custom motorized & manual blind systems designed for ideal light regulation.',
      description: 'Sleek motorized roller blinds, Roman blinds, wooden Venetian blinds, and honeycomb structures tailored to exact window dimensions.',
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 3,
      isFeatured: false,
    },
    {
      name: 'Premium Cloth Curtains',
      shortDescription: 'Opulent velvet, linen, and sheer drapes with custom tailored draping styles.',
      description: 'Exquisite cloth curtain solutions sourced from international textile houses. Layered sheers and blackout curtains with motorization options.',
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 4,
      isFeatured: true,
    },
    {
      name: 'Wallpapers',
      shortDescription: 'Designer textured, mural, and metallic wallpaper collections.',
      description: 'Exclusive imported wallpapers offering botanical prints, subtle geometric textures, seamless fabric backings, and customized digital murals.',
      coverImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 5,
      isFeatured: false,
    },
    {
      name: 'Décor Items',
      shortDescription: 'Handpicked sculptures, wall art, vases, and accent artifacts.',
      description: 'Curated accent pieces that elevate empty corners into artistic statements. Metal wall sculptures, handcrafted ceramics, and bespoke mirrors.',
      coverImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 6,
      isFeatured: false,
    },
    {
      name: 'Indoor Plants & Pots',
      shortDescription: 'Biophilic interior landscaping with designer fiberglass & ceramic planters.',
      description: 'Integrating lush natural greenery into living and working spaces with low-maintenance exotic foliage and architectural planters.',
      coverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 7,
      isFeatured: false,
    },
    {
      name: 'Painting Work',
      shortDescription: 'Flawless interior and exterior architectural coating application.',
      description: 'High-end paint finishes utilizing low-VOC premium paints, precise masking, surface preparation, and long-lasting protective coats.',
      coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 8,
      isFeatured: false,
    },
    {
      name: 'Texture Work',
      shortDescription: 'Limewash, Venetian plaster, concrete finish, and metallic wall textures.',
      description: 'Tactile wall treatments applied by skilled artisans. Organic limewash, polished Venetian plaster, and tactile stone effect finishes.',
      coverImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 9,
      isFeatured: true,
    },
    {
      name: 'Furniture Modelling',
      shortDescription: 'Bespoke custom furniture design and high-detail 3D visualization.',
      description: 'Custom sofa crafting, ergonomic dining tables, modular wardrobe systems, and precision 3D CAD modeling prior to production.',
      coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 10,
      isFeatured: false,
    },
  ];

  for (const s of initialServices) {
    const slug = s.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    await prisma.service.upsert({
      where: { slug },
      update: s,
      create: { ...s, slug },
    });
  }
  console.log('✅ Services seeded successfully');

  // 4. Seed Our Works (Completed Architectural Projects)
  const initialProjects = [
    {
      name: 'The Crestwood Villa — Ernakulam',
      slug: 'crestwood-villa-ernakulam',
      location: 'Ernakulam, Kerala',
      projectType: 'Luxury Residential Villa',
      description: 'A 4,500 sq ft contemporary tropical villa featuring open-plan living, custom velvet draping, limewash wall textures, biophilic planter nooks, and custom teak furniture modeling.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      servicesInvolved: 'Interior Design, Venetian Texture, Motorized Drapes, Custom Furniture',
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Urban Penthouse Suite — Kozhikode',
      slug: 'urban-penthouse-kozhikode',
      location: 'Kozhikode, Kerala',
      projectType: 'High-Rise Penthouse Apartment',
      description: 'Sophisticated modern apartment interior with dark charcoal accents, imported Italian wallpaper feature walls, motorized Roman blinds, and warm ambient recessed lighting.',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      servicesInvolved: 'Interior Design, Wallpapers, Blinds & Curtains',
      isPublished: true,
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: 'Serene Heritage Suite — Kottayam',
      slug: 'serene-heritage-kottayam',
      location: 'Kottayam, Kerala',
      projectType: 'Heritage Villa Restoration',
      description: 'Blending traditional Kerala wooden architecture with contemporary minimalist interiors, hand-troweled Venetian plaster, and lush indoor planters.',
      coverImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c5172?auto=format&fit=crop&w=1200&q=80',
      servicesInvolved: 'Interior Architecture, Texture Work, Indoor Plants',
      isPublished: true,
      isFeatured: true,
      displayOrder: 3,
    },
  ];

  for (const p of initialProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('✅ Projects / Our Works seeded successfully');

  // 5. Seed Catalog Items (Exactly 5 Items)
  const curtainsService = await prisma.service.findUnique({ where: { slug: 'premium-cloth-curtains' } });
  const blindsService = await prisma.service.findUnique({ where: { slug: 'blinds' } });
  const wallpapersService = await prisma.service.findUnique({ where: { slug: 'wallpapers' } });
  const textureService = await prisma.service.findUnique({ where: { slug: 'texture-work' } });
  const furnitureService = await prisma.service.findUnique({ where: { slug: 'furniture-modelling' } });

  const initialItems = [
    {
      serviceId: curtainsService?.id,
      name: 'Royal Velvet Blackout Drapes',
      slug: 'royal-velvet-blackout-drapes',
      category: 'Velvet Drapes',
      material: 'Triple-Weave Imported Italian Velvet',
      shortDescription: 'Luxurious thermal blackout curtains with custom acoustic dampening and ripple-fold pleats.',
      description: 'Handcrafted tailored royal velvet drapes offering 100% light blockout, thermal insulation, and an elegant cascading drape suitable for living lounges and master bedrooms.',
      specifications: 'Light Opacity: 100% Blackout | Wash Care: Dry Clean Only | Header: Ripple Fold / Pinch Pleat | Width: Customizable',
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
      media: [
        {
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
          type: 'IMAGE' as const,
          title: 'Royal Velvet Drapes',
        },
      ],
    },
    {
      serviceId: blindsService?.id,
      name: 'Motorized Zebra Day & Night Blinds',
      slug: 'motorized-zebra-day-night-blinds',
      category: 'Motorized Roller Blinds',
      material: 'Dual-Layer Anti-Static Polyester Fabric',
      shortDescription: 'Smart motorized dual-roller blinds with wireless remote, voice control, and precision light filtering.',
      description: 'Contemporary Zebra blinds with alternating sheer and solid fabric bands. Compatible with Alexa, Google Home, and smartphone automation.',
      specifications: 'Motor: Rechargeable Somfy RTS Motor | Battery Life: 6 Months per charge | Control: Remote, App, Voice',
      isPublished: true,
      isFeatured: true,
      displayOrder: 2,
      media: [
        {
          url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
          type: 'IMAGE' as const,
          title: 'Zebra Blinds',
        },
      ],
    },
    {
      serviceId: wallpapersService?.id,
      name: 'Botanical Gold Leaf Textured Wallpaper',
      slug: 'botanical-gold-leaf-textured-wallpaper',
      category: 'Metallic & Textured',
      material: 'Non-Woven Embossed Vinyl with Gold Foil Accents',
      shortDescription: 'Hand-detailed tropical foliage wallpaper with subtle metallic gold veins and tactile texture.',
      description: 'Premium luxury feature wall covering that brings nature-inspired elegance into bedrooms, dining rooms, and executive office backdrops.',
      specifications: 'Roll Dimensions: 10m x 0.53m | Surface: Scrubbable & Moisture Resistant | Application: Paste-the-Wall',
      isPublished: true,
      isFeatured: true,
      displayOrder: 3,
      media: [
        {
          url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
          type: 'IMAGE' as const,
          title: 'Botanical Wallpaper',
        },
      ],
    },
    {
      serviceId: textureService?.id,
      name: 'Polished Italian Venetian Stucco Plaster',
      slug: 'polished-italian-venetian-stucco-plaster',
      category: 'Artisan Wall Texture',
      material: 'Authentic Slaked Lime & Micro-Marble Dust',
      shortDescription: 'High-gloss mirror-finish Italian marble plaster applied with multi-layered hand troweling.',
      description: 'Timeless Venetian plaster creating deep, luminous marble-like veins with a satin-smooth tactile feel. Naturally breathable, anti-fungal, and zero VOC.',
      specifications: 'Finish: High Sheen Polished Wax | Thickness: 1.5mm - 2mm | Eco Rating: Zero VOC & Non-Toxic',
      isPublished: true,
      isFeatured: true,
      displayOrder: 4,
      media: [
        {
          url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
          type: 'IMAGE' as const,
          title: 'Venetian Plaster',
        },
      ],
    },
    {
      serviceId: furnitureService?.id,
      name: 'Bespoke Curvature Lounge Sectional Sofa',
      slug: 'bespoke-curvature-lounge-sectional-sofa',
      category: 'Custom Upholstery Furniture',
      material: 'Teak Wood Internal Frame & High-Density Memory Foam & Bouclé Fabric',
      shortDescription: 'Custom 3D-modeled organic curved sofa crafted for luxury open-concept living rooms.',
      description: 'Artisan-crafted curvilinear sectional sofa engineered for ergonomic posture and visual luxury. Wrapped in textured cream bouclé upholstery with solid brass recessed plinth base.',
      specifications: 'Frame: Seasoned Burma Teak | Fabric: Stain-Repellent Heavyweight Bouclé | Warranty: 10-Year Structural',
      isPublished: true,
      isFeatured: true,
      displayOrder: 5,
      media: [
        {
          url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
          type: 'IMAGE' as const,
          title: 'Custom Curved Sectional',
        },
      ],
    },
  ];

  for (const it of initialItems) {
    if (!it.serviceId) continue;
    const { media, ...itemData } = it;
    const cleanItemData = {
      ...itemData,
      serviceId: it.serviceId as string,
    };
    const createdItem = await prisma.item.upsert({
      where: { slug: cleanItemData.slug },
      update: cleanItemData,
      create: cleanItemData,
    });

    for (const m of media) {
      const existingMedia = await prisma.itemMedia.findFirst({
        where: { itemId: createdItem.id, url: m.url },
      });
      if (!existingMedia) {
        await prisma.itemMedia.create({
          data: {
            itemId: createdItem.id,
            url: m.url,
            type: m.type,
            title: m.title,
          },
        });
      }
    }
  }
  console.log('✅ Exactly 5 Catalog Items seeded successfully');

  // 6. Seed Gallery Showcase Media
  const initialGallery = [
    {
      title: 'Velvet Fabric Drapes & Custom Motorized Railings',
      description: 'Custom tailored velvet curtains with automated ceiling track systems.',
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      displayOrder: 1,
    },
    {
      title: 'Contemporary Villa Exterior Architectural Elevation',
      description: 'Modern minimalist facade design with weather-resistant claddings.',
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      displayOrder: 2,
    },
    {
      title: 'Artisan Venetian Plaster & Wall Texturing',
      description: 'Hand-troweled polished plaster wall finish with organic stone texture.',
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      displayOrder: 3,
    },
    {
      title: 'Designer Imported Wallpaper Nook',
      description: 'Botanical print textured wallpaper integrated into bedroom headboard wall.',
      type: 'IMAGE' as const,
      url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      displayOrder: 4,
    },
  ];

  for (const g of initialGallery) {
    const existing = await prisma.galleryItem.findFirst({ where: { url: g.url } });
    if (!existing) {
      await prisma.galleryItem.create({ data: g });
    }
  }
  console.log('✅ Gallery showcase items seeded successfully');

  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
