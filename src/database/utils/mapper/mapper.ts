export type OrmEntityMapperFn<OrmEntity, BusinessEntity> = (ormEntity: OrmEntity) => BusinessEntity;
export type BusinessEntityMapperFn<BusinessEntity, OrmEntity> = (businessEntity: BusinessEntity) => OrmEntity;

export type Mapper<OrmEntity, BusinessEntity> = {
  fromOrmEntity: OrmEntityMapperFn<OrmEntity, BusinessEntity>;
  fromBusinessEntity: BusinessEntityMapperFn<BusinessEntity, OrmEntity>;
};
